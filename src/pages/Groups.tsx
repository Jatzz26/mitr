import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { ShieldCheck, AlertTriangle, SmilePlus, Hash, Users as UsersIcon, Info, HeartHandshake, MessageSquare, Bell, BellOff } from "lucide-react";

type Msg = { id: string; room: string; content: string; user_id: string; created_at?: string };

const ROOMS = [
  { key: "general", label: "General", color: "" },
  { key: "anxiety", label: "Anxiety", color: "text-emerald-600" },
  { key: "depression", label: "Depression", color: "text-blue-600" },
  { key: "exam-stress", label: "Exam Stress", color: "text-purple-600" },
];

const ROOM_META: Record<string, { prompts: string[]; resources: { title: string; url: string }[] }> = {
  general: {
    prompts: [
      "What's one small win today?",
      "How do you recharge after a busy day?",
    ],
    resources: [
      { title: "AI Coping Strategies", url: "/chatbot" },
      { title: "Journaling Tips", url: "/journal" },
    ],
  },
  anxiety: {
    prompts: [
      "Try box breathing: In 4, hold 4, out 4, hold 4.",
      "What situations trigger anxiety and what helps?",
    ],
    resources: [
      { title: "Guided Relaxation", url: "/resources" },
      { title: "Book a Counsellor", url: "/booking" },
    ],
  },
  depression: {
    prompts: [
      "Name one thing you’re grateful for.",
      "What small task can you complete now?",
    ],
    resources: [
      { title: "Emergency Resources", url: "/resources" },
      { title: "Assessment", url: "/assessment" },
    ],
  },
  "exam-stress": {
    prompts: [
      "What’s a realistic study block for you today?",
      "Share a tip that helps you focus.",
    ],
    resources: [
      { title: "Study Techniques", url: "/resources" },
      { title: "Wellness Journal", url: "/journal" },
    ],
  },
};

const SUPPORT_TEMPLATES = [
  "I hear you. That sounds really tough.",
  "Thank you for sharing. You’re not alone here.",
  "Would grounding or a short walk help right now?",
  "Breathing together: In 4, hold 4, out 4, hold 4.",
];

const RISK_KEYWORDS = ["suicide", "kill myself", "self-harm", "hurt myself", "end it", "die", "harm"];

export default function Groups() {
  const defaultRoom = "general";
  const { user } = useAuth();
  const { toast } = useToast();
  const [room, setRoom] = useState(defaultRoom);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const channelRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState<boolean>(() => localStorage.getItem("groups_muted") === "true");
  const [emoji, setEmoji] = useState<string>("💛");
  const [reactions, setReactions] = useState<Record<string, number>>({}); // ephemeral client-side reactions count per message

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("group_messages")
        .select("id, room, content, user_id, created_at")
        .eq("room", room)
        .order("created_at", { ascending: true });
      if (!error && data) setMessages(data as any);
    };
    load();

    if (channelRef.current) supabase.removeChannel(channelRef.current);
    const ch = supabase
      .channel(`room-${room}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "group_messages", filter: `room=eq.${room}` }, (payload) => {
        const msg = payload.new as any as Msg;
        setMessages((prev) => [...prev, msg]);
        // Basic at-risk detection notify (non-blocking)
        const contentLower = (msg.content || "").toLowerCase();
        if (!muted && RISK_KEYWORDS.some(k => contentLower.includes(k))) {
          toast({ title: "Someone may need help", description: "A message contains sensitive content. Consider offering support or contacting resources.", variant: "default" });
        }
      })
      .subscribe();
    channelRef.current = ch;
    return () => {
      if (ch) supabase.removeChannel(ch);
    };
  }, [room]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }
    const content = text.trim();
    if (!content) return;
    setText("");
    const { error } = await supabase.from("group_messages").insert({
      room,
      content,
      user_id: user.id,
    } as any);
    if (error) toast({ title: "Send failed", description: error.message, variant: "destructive" });
  };

  const isRisky = (c: string) => {
    const s = (c || "").toLowerCase();
    return RISK_KEYWORDS.some(k => s.includes(k));
  };

  const addReaction = (id: string) => {
    setReactions((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Peer Support Groups
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> Anonymous & Moderated</Badge>
              <Button variant="outline" size="sm" onClick={() => { const next = !muted; setMuted(next); localStorage.setItem("groups_muted", String(next)); }}>
                {muted ? <><BellOff className="w-4 h-4 mr-1"/>Muted</> : <><Bell className="w-4 h-4 mr-1"/>Alerts On</>}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.assign('/resources')}>
                <AlertTriangle className="w-4 h-4 mr-1"/> Get Help
              </Button>
            </div>
          </div>

          {/* Room navigation */}
          <Card className="bg-card border border-card-border rounded-2xl">
            <CardContent className="p-3 flex flex-wrap items-center gap-2">
              <div className="hidden md:flex items-center gap-2" role="tablist" aria-label="Rooms">
                {ROOMS.map(r => (
                  <Button key={r.key} role="tab" aria-selected={room===r.key} variant={room===r.key?"secondary":"ghost"} className="rounded-full" onClick={()=>setRoom(r.key)}>
                    <Hash className="w-4 h-4 mr-1"/> {r.label}
                  </Button>
                ))}
              </div>
              <div className="md:hidden flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Room</span>
                <select className="border rounded-md px-2 py-2 bg-background" value={room} onChange={(e) => setRoom(e.target.value)} aria-label="Select room">
                  {ROOMS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                </select>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                <UsersIcon className="w-4 h-4"/> Live updates enabled
              </div>
            </CardContent>
          </Card>

          {/* Pinned prompts/resources */}
          <Card className="bg-card border border-card-border rounded-2xl">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium mb-2 flex items-center gap-2"><Info className="w-4 h-4"/> Discussion Prompts</div>
                <div className="flex flex-wrap gap-2">
                  {ROOM_META[room]?.prompts.map((p, idx) => (
                    <Button key={idx} variant="outline" size="sm" onClick={()=> setText(t=> (t? t+" ":"") + p)}>{p}</Button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-2 flex items-center gap-2"><HeartHandshake className="w-4 h-4"/> Helpful Resources</div>
                <div className="flex flex-wrap gap-2">
                  {ROOM_META[room]?.resources.map((r) => (
                    <Button key={r.title} variant="ghost" size="sm" onClick={()=> window.location.assign(r.url)}>{r.title}</Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="bg-card border border-card-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Hash className="w-4 h-4"/> {ROOMS.find(r=>r.key===room)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={listRef} className="border border-card-border rounded-md p-3 h-[50vh] overflow-y-auto bg-background space-y-3" role="log" aria-live="polite">
                {messages.map((m) => (
                  <div key={m.id} className="text-left">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">anon-{m.user_id.slice(0, 6)}</span>
                      <span>• {new Date(m.created_at ?? '').toLocaleString()}</span>
                      {isRisky(m.content) && (
                        <Badge variant="secondary" className="rounded-full"><AlertTriangle className="w-3.5 h-3.5 mr-1"/> sensitive</Badge>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
                      <span>{m.content}</span>
                      <button aria-label="React" className="text-lg hover:opacity-80" onClick={()=> addReaction(m.id)}>{emoji}</button>
                      {reactions[m.id] ? <span className="text-xs text-muted-foreground">{reactions[m.id]}</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Composer */}
          <Card className="bg-card border border-card-border rounded-2xl">
            <CardContent className="p-3 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1">
                  <Input aria-label="Write a message" placeholder="Write a message (Shift+Enter for newline)" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
                </div>
                <div className="flex items-center gap-2">
                  <select className="border rounded-md px-2 py-2 bg-background" aria-label="Select reaction" value={emoji} onChange={(e)=>setEmoji(e.target.value)}>
                    {['💛','👏','🙏','🌿','💪','😊'].map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <Button onClick={send} aria-label="Send message">Send</Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUPPORT_TEMPLATES.map((t,i) => (
                  <Button key={i} variant="outline" size="sm" onClick={()=> setText(prev => (prev? prev+" ":"") + t)}><SmilePlus className="w-4 h-4 mr-1"/> {t}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


