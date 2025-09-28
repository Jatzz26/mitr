import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import type { HealthRecord } from "@/types/health";
import { supabase } from "@/lib/supabaseClient";

async function buildAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const t = data.session?.access_token;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function MedPlusChat({ record }: { record: HealthRecord | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function send(msg?: string) {
    const content = msg ?? inputRef.current?.value ?? "";
    if (!content.trim()) return;
    setMessages((m) => [...m, { role: "user", text: content }]);
    if (inputRef.current) inputRef.current.value = "";

    try {
      const headers = { "Content-Type": "application/json", ...(await buildAuthHeader()) };
      const res = await fetch("/functions/v1/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: content, record_id: record?.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((m) => [...m, { role: "bot", text: data.response || "I'm here to help." }]);
        return;
      }
    } catch {}

    // Local fallback (mock) if Edge Function is not available
    const mock = buildMockChatResponse(content, record);
    setMessages((m) => [...m, { role: "bot", text: mock }]);
    // Persist to chat_history for continuity
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      await supabase.from("chat_history").insert({
        user_id: user.id,
        user_message: content,
        bot_response: mock,
        context: { record_id: record?.id, source: "mock" },
      });
    }
  }

  useEffect(() => {
    // Optionally preload chat history here
  }, []);

  return (
    <>
      <button
        className="fixed bottom-4 right-4 rounded-full bg-primary text-primary-foreground p-3 shadow-lg"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open MedPlus chat"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 w-80 max-h-[60vh] bg-card border border-card-border rounded-xl shadow-2xl p-3 flex flex-col z-[70]">
          <div className="text-sm font-semibold mb-2">
            MedPlus AI
            {record ? (
              <span className="ml-1 text-xs text-muted-foreground">Context: {record.metadata?.test_name || record.record_type}</span>
            ) : null}
          </div>
          <div className="flex-1 overflow-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span className={`inline-block rounded-lg px-2 py-1 ${m.role === "user" ? "bg-primary/10" : "bg-muted"}`}>{m.text}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input ref={inputRef} className="flex-1 input border rounded-md px-2 py-1 bg-background" placeholder="Ask about your report..." />
            <button onClick={() => send()} className="btn px-2 py-1 rounded-md bg-primary text-primary-foreground"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
}

function buildMockChatResponse(message: string, record: HealthRecord | null): string {
  const md: any = record?.metadata || {};
  const name = md.test_name || record?.record_type || "your report";
  const ldl = md.LDL ?? md.ldl;
  const hdl = md.HDL ?? md.hdl;
  const alt = md.ALT ?? md.alt;
  const parts: string[] = [];
  parts.push(`You're asking about ${name}.`);
  if (ldl != null) parts.push(`LDL is ${ldl} mg/dL; lower is generally better.`);
  if (hdl != null) parts.push(`HDL is ${hdl} mg/dL; higher is protective.`);
  if (alt != null) parts.push(`ALT is ${alt} U/L; persistent elevation may warrant follow-up.`);
  parts.push("This is informational, consult a physician.");
  return parts.join(" ");
}
