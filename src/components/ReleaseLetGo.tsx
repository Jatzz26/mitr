import { useEffect, useMemo, useRef, useState } from "react";
import { X, Flame, Eraser, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";

interface ReleaseLetGoProps {
  open: boolean;
  onClose: () => void;
}

export default function ReleaseLetGo({ open, onClose }: ReleaseLetGoProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [isBurning, setIsBurning] = useState(false);
  const [isBurned, setIsBurned] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [showAshes, setShowAshes] = useState(false);
  const [showSprout, setShowSprout] = useState(false);
  const [newThought, setNewThought] = useState("");
  const [saving, setSaving] = useState(false);
  const ytPlayerRef = useRef<any>(null);
  const ytReadyRef = useRef<boolean>(false);

  const ashes = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: Math.random() * 90 + 5, // percent
    delay: Math.random() * 0.6,
    duration: 1.2 + Math.random() * 1.5,
    size: 3 + Math.random() * 5,
  })), [isBurning]);

  useEffect(() => {
    if (!open) {
      // reset state when modal is closed
      setIsBurning(false);
      setIsBurned(false);
      setText("");
      setNewThought("");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.stopVideo(); } catch {}
      }
    }
  }, [open]);

  const saveNewThought = async () => {
    const content = newThought.trim();
    if (!content) {
      toast({ title: "Write a new thought", description: "Please jot a new, kinder thought before saving.", variant: "default" });
      return;
    }
    if (!user) {
      toast({ title: "Please sign in", description: "Sign in to save your thought to Journal.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      // Try inserting with optional columns first
      const base: any = {
        user_id: user.id,
        title: "New Thought (Release & Let Go)",
        content,
        book: "Wellness Journal",
        tags: ["release", "reframe"],
      };
      let { error } = await supabase.from("journals").insert(base);
      if (error && /column .* book/.test(error.message)) {
        const { error: e2 } = await supabase.from("journals").insert({ user_id: user.id, title: base.title, content: base.content } as any);
        error = e2 as any;
      }
      if (error) throw error;
      toast({ title: "Saved to Journal" });
      setNewThought("");
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Load YouTube IFrame API and prepare player for sound-only playback
  useEffect(() => {
    if (!open) return;
    const scriptId = "youtube-iframe-api";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    const initPlayer = () => {
      if (ytPlayerRef.current || !(window as any).YT || !(window as any).YT.Player) return;
      ytPlayerRef.current = new (window as any).YT.Player("yt-burn-audio", {
        videoId: "UgHKb_7884o",
        height: "0",
        width: "0",
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => { ytReadyRef.current = true; try { ytPlayerRef.current.setVolume(100); } catch {} },
        }
      });
    };
    if (!existing) {
      const tag = document.createElement("script");
      tag.id = scriptId;
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => { initPlayer(); };
    } else {
      // If API already loaded
      if ((window as any).YT && (window as any).YT.Player) initPlayer();
      else (window as any).onYouTubeIframeAPIReady = () => { initPlayer(); };
    }
  }, [open]);

  const handleBurn = () => {
    if (!text.trim()) return;
    setIsBurning(true);
    if (soundOn) {
      let played = false;
      if (ytPlayerRef.current && ytReadyRef.current) {
        try {
          ytPlayerRef.current.seekTo(0, true);
          ytPlayerRef.current.setVolume(100);
          ytPlayerRef.current.playVideo();
          played = true;
        } catch {}
      }
      if (!played && audioRef.current) {
        try { audioRef.current.currentTime = 0; audioRef.current.volume = 1; audioRef.current.play(); } catch {}
      }
    }
    // Finish after animation duration
    setTimeout(() => {
      setIsBurned(true);
      setIsBurning(false);
      setShowAshes(true);
      // After ashes settle, grow sprout
      setTimeout(() => setShowSprout(true), 900);
      // Stop YT after burn completes
      if (ytPlayerRef.current) { try { ytPlayerRef.current.stopVideo(); } catch {} }
      if (audioRef.current) { try { audioRef.current.pause(); } catch {} }
    }, 4200);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="release-heading"
          className="w-full max-w-3xl bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-card-border bg-card/80">
            <div>
              <h2 id="release-heading" className="text-xl font-semibold">Release & Let Go</h2>
              <p className="text-sm text-muted-foreground">Writing and destroying your worries can help your mind find calm.</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {!isBurned ? (
              <>
                <div
                  ref={paperRef}
                  className={
                    "relative rounded-2xl border border-card-border bg-[url('https://images.unsplash.com/photo-1528109986153-06ea6f3a1a3a?q=80&w=1200&auto=format&fit=crop')] bg-center bg-cover " +
                    "shadow-card p-4 min-h-[260px] transition-all overflow-hidden " +
                    (isBurning ? "animate-[burnFull_4.2s_ease-in-out_forwards]" : "")
                  }
                  aria-live="polite"
                >
                  {/* paper overlay for readability */}
                  <div className="absolute inset-0 bg-background/70 rounded-2xl" />
                  {/* Textarea-like content */}
                  <textarea
                    className="relative z-10 w-full min-h-[220px] resize-none bg-transparent outline-none text-base leading-relaxed placeholder:text-muted-foreground"
                    placeholder="Write your thoughts here and watch them burn away..."
                    value={text}
                    onChange={(e)=>setText(e.target.value)}
                    disabled={isBurning}
                    aria-label="Your thoughts"
                  />

                  {/* Flames overlay and ash during burn */}
                  {isBurning && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                      {/* flame */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl animate-[flicker_1s_ease-in-out_infinite]">🔥</div>
                      {/* ash particles */}
                      {ashes.map(a => (
                        <span
                          key={a.id}
                          className="block absolute bg-foreground/70 rounded"
                          style={{
                            left: a.left + '%',
                            top: '10%',
                            width: a.size,
                            height: a.size,
                            animation: `ashFall ${a.duration}s ease-in ${a.delay}s forwards`,
                          }}
                        />
                      ))}
                      {/* smoke overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/10 to-black/20 animate-[smokeDrift_4s_ease-in-out_infinite] mix-blend-multiply" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" className="gap-2" onClick={() => setText("")}> 
                      <Eraser className="w-4 h-4"/> Clear
                    </Button>
                    <Button type="button" onClick={(e)=>{ e.preventDefault(); handleBurn(); }} className="gap-2">
                      <Flame className="w-4 h-4"/> Burn Paper
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundOn((s)=>!s)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    aria-pressed={soundOn}
                    aria-label={soundOn ? "Mute sound" : "Unmute sound"}
                  >
                    {soundOn ? <Volume2 className="w-4 h-4"/> : <VolumeX className="w-4 h-4"/>}
                    {soundOn ? "Sound on" : "Sound off"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 space-y-5">
                {/* Ashes pile */}
                {showAshes && (
                  <div className="relative mx-auto w-40 h-16">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-gradient-to-t from-foreground/70 to-transparent rounded-full blur-sm opacity-70" />
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-36 h-4 bg-foreground/80 rounded-full" />
                  </div>
                )}
                {/* Sprout grows out of ashes */}
                {showSprout && (
                  <div className="relative mx-auto w-24 h-32 animate-[sproutUp_1.6s_ease-out_forwards]">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-0.5 bg-green-600 rounded-full animate-[stemGrow_1.2s_ease-out_forwards] origin-bottom" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-[110%] w-4 h-2 bg-green-500 rounded-full rotate-[-25deg] animate-[leafLeft_1.2s_0.6s_ease-out_forwards] opacity-0" />
                    <div className="absolute bottom-7 left-1/2 translate-x-[10%] w-4 h-2 bg-green-500 rounded-full rotate-[25deg] animate-[leafRight_1.2s_0.6s_ease-out_forwards] opacity-0" />
                  </div>
                )}
                <h3 className="text-xl font-semibold">Your thoughts have been released.</h3>
                <p className="text-muted-foreground">Take a deep breath. Plant a new, kinder thought.</p>
                <div className="max-w-md mx-auto">
                  <textarea
                    placeholder="A new thought…"
                    className="w-full min-h-[90px] rounded-xl border border-card-border bg-background p-3"
                    value={newThought}
                    onChange={(e)=>setNewThought(e.target.value)}
                  />
                </div>
                <div className="pt-1 flex items-center justify-center gap-2">
                  <Button type="button" variant="outline" onClick={saveNewThought} disabled={saving} className="rounded-xl">{saving ? "Saving..." : "Save new thought to Journal"}</Button>
                  <Button type="button" onClick={onClose} className="rounded-xl">Close</Button>
                </div>
              </div>
            )}

            {/* Accessibility hint */}
            {!isBurned && (
              <p className="text-xs text-muted-foreground">Tip: Use Tab to focus, type your note, then press Burn Paper. This works great on mobile and desktop.</p>
            )}
          </div>
        </div>
      </div>

      {/* Audio element using a public domain fire sound */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/01/07/audio_6a1b8b0c7b.mp3?filename=burning-paper-amp-fire-114356.mp3"
        preload="auto"
        className="hidden"
      />
      {/* Hidden YouTube player for burn sound */}
      <div id="yt-burn-audio" className="hidden" aria-hidden="true" />

      {/* Keyframes */}
      <style>{`
        @keyframes burnFull {
          0% { filter: none; opacity: 1; mask: radial-gradient(circle at 50% 90%, rgba(0,0,0,0) 0%, black 1%); }
          20% { filter: brightness(1.05) contrast(0.98) saturate(1.08); }
          40% { opacity: 0.9; filter: sepia(0.15) blur(0.4px); }
          60% { opacity: 0.7; filter: sepia(0.3) blur(0.8px); }
          80% { opacity: 0.45; transform: scale(0.995); }
          100% { opacity: 0; transform: scale(0.985); filter: sepia(0.5) blur(1.1px); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.6; transform: translateY(0px) rotate(-1deg); }
          50% { opacity: 1; transform: translateY(-2px) rotate(1deg); }
        }
        @keyframes ashFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
          90% { opacity: 0.7; }
          100% { transform: translateY(160px) rotate(25deg); opacity: 0; }
        }
        @keyframes stemGrow {
          0% { height: 2px; }
          100% { height: 56px; }
        }
        @keyframes leafLeft {
          0% { transform: translate(-110%, 0) rotate(-25deg); opacity: 0; }
          100% { transform: translate(-110%, -10px) rotate(-8deg); opacity: 1; }
        }
        @keyframes leafRight {
          0% { transform: translate(10%, 0) rotate(25deg); opacity: 0; }
          100% { transform: translate(10%, -6px) rotate(8deg); opacity: 1; }
        }
        @keyframes sproutUp {
          0% { transform: translateY(8px); opacity: 0.6; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes smokeDrift {
          0% { opacity: 0.15; }
          50% { opacity: 0.3; }
          100% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
