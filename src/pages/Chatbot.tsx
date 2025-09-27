import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Trash2, Send, Sparkles, Loader2, Volume2, Mic, MicOff } from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; text: string; lang: string };

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export default function Chatbot() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("auto");
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SR = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "";
      recognitionRef.current.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
      };
      recognitionRef.current.onerror = () => setRecording(false);
      recognitionRef.current.onend = () => setRecording(false);
    }
  }, []);

  const speak = (text: string, langCode?: string) => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    if (langCode) utter.lang = langCode;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const detectLang = async (text: string) => {
    // Simple heuristic; in production use a proper language id model/API.
    // For now, return 'en-US' default.
    return "en-US";
  };

  const sendMessage = async () => {
    const content = input.trim();
    if (!content) return;
    setInput("");

    const userLang = lang === "auto" ? await detectLang(content) : lang;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: content, lang: userLang };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);

    if (!apiKey) {
      toast({ title: "Missing API key", description: "Set VITE_GEMINI_API_KEY in your .env and restart dev server.", variant: "destructive" });
      setThinking(false);
      return;
    }

    try {
      const systemPrompt = `You are a multilingual, empathetic mental health support assistant. Language: ${userLang}. Be concise and supportive.`;
      const fullPrompt = `${systemPrompt}\n\nUser: ${content}`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      
      const assistantLang = userLang;
      const botMsg: Message = { id: crypto.randomUUID(), role: "assistant", text, lang: assistantLang };
      setMessages((prev) => [...prev, botMsg]);
      speak(text, assistantLang);
    } catch (e: any) {
      console.error("Gemini API error:", e);
      const message = e?.message || "Request failed";
      toast({ title: "Chat error", description: `API Error: ${message}`, variant: "destructive" });
    } finally { setThinking(false); }
  };

  const startStopRecording = () => {
    if (!recognitionRef.current) {
      toast({ title: "Voice not supported", description: "Speech recognition not available in this browser." });
      return;
    }
    if (recording) {
      recognitionRef.current.stop();
      setRecording(false);
    } else {
      try {
        recognitionRef.current.lang = lang === "auto" ? "en-US" : lang;
        recognitionRef.current.start();
        setRecording(true);
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border border-card-border rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">AI Chatbot</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <select aria-label="Language" className="border rounded-md px-2 py-2 bg-background" value={lang} onChange={(e) => setLang(e.target.value)}>
                  <option value="auto">Auto</option>
                  <option value="en-US">English</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="bn-IN">Bengali</option>
                  <option value="ta-IN">Tamil</option>
                  <option value="te-IN">Telugu</option>
                  <option value="mr-IN">Marathi</option>
                  <option value="gu-IN">Gujarati</option>
                  <option value="kn-IN">Kannada</option>
                  <option value="ml-IN">Malayalam</option>
                  <option value="pa-IN">Punjabi</option>
                  <option value="ur-PK">Urdu</option>
                </select>
                <Button onClick={startStopRecording} variant={recording ? "destructive" : "outline"} className="gap-2">
                  {recording ? <MicOff className="w-4 h-4"/> : <Mic className="w-4 h-4"/>}
                  {recording ? "Stop" : "Voice"}
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => {
                  if (messages.length === 0) return;
                  const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `chat-${Date.now()}.json`; a.click();
                  URL.revokeObjectURL(url);
                }}>
                  <Download className="w-4 h-4"/> Export
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => setMessages([])}>
                  <Trash2 className="w-4 h-4"/> Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={listRef} className="h-[60vh] md:h-[65vh] overflow-y-auto p-4 space-y-3 bg-background" role="log" aria-live="polite">
                {messages.map((m) => (
                  <div key={m.id} className={"flex w-full " + (m.role === "user" ? "justify-end" : "justify-start") }>
                    <div className={(m.role === "user" ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm" : "bg-muted text-foreground rounded-2xl rounded-bl-sm") + " px-4 py-2 shadow-card max-w-[80%] transition-all"}>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    <span>Assistant is typing…</span>
                  </div>
                )}
              </div>

              {/* Sticky composer */}
              <div className="sticky bottom-0 inset-x-0 border-t border-card-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 p-3">
                <div className="flex items-end gap-2 max-w-3xl mx-auto">
                  <textarea
                    aria-label="Type your message"
                    placeholder="Type your message"
                    value={input}
                    onChange={(e)=>setInput(e.target.value)}
                    onKeyDown={(e)=> { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-card-border bg-background p-3 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] max-h-[160px]"
                  />
                  <Button onClick={sendMessage} className="rounded-xl h-[44px] px-4 gap-2" aria-label="Send message">
                    <Send className="w-4 h-4"/> Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


