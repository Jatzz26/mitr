import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, MessageSquare, ShieldCheck, HeartHandshake, Mic, Image as ImageIcon, Paperclip, Smile, Flag, Users, Search, Pin, Calendar, ChevronRight } from "lucide-react";

// Types
export type Role = "doctor" | "counselor" | "mentor" | "admin" | "member";
export type User = { id: string; name: string; role: Role; status?: "online" | "busy" | "offline"; anonymous?: boolean };
export type Message = { id: string; user: User; text: string; ts: string; reactions?: { [emoji: string]: number }; replies?: Message[]; pinned?: boolean };
export type Channel = { id: string; name: string; topic: string; pinned: { title: string; url?: string }[]; messages: Message[]; professionalPresent?: boolean; professionalType?: "doctor" | "counselor"; category: "mental" | "physical"; group?: "core" | "other" };

// Mock data
const users: User[] = [
  { id: "u1", name: "Dr. Asha", role: "doctor", status: "online" },
  { id: "u2", name: "Rohan", role: "mentor", status: "online" },
  { id: "u3", name: "Counselor Meera", role: "counselor", status: "busy" },
  { id: "u4", name: "Admin", role: "admin", status: "online" },
  { id: "u5", name: "Anon Student", role: "member", anonymous: true, status: "offline" },
];

function nowISO() { return new Date().toISOString(); }

const initialChannels: Channel[] = [
  {
    id: "anxiety", name: "# anxiety", topic: "Coping skills, grounding, CBT tips",
    pinned: [ { title: "Breathing techniques (PDF)", url:"#" }, { title: "Free helplines", url:"/emergency" } ],
    professionalPresent: true, professionalType: "counselor", category: "mental", group: "core",
    messages: [
      { id: "m1", user: users[1], text: "What helps you during anxious mornings?", ts: nowISO(), reactions: { "👍": 3, "💜": 2 }, replies: [ { id: "m1r1", user: users[0], text: "Box breathing + short walk.", ts: nowISO() } ] },
      { id: "m2", user: users[2], text: "Q&A at 6pm today — drop questions here.", ts: nowISO(), pinned: true },
    ]
  },
  {
    id: "depression", name: "# depression", topic: "Low mood, routines, support",
    pinned: [ { title: "Daily routine planner", url: "#" } ], professionalType: "counselor", category: "mental", group: "core",
    messages: [ { id: "m3", user: users[4], text: "Any tips for starting assignments when energy is low?", ts: nowISO() } ]
  },
  { id: "mindfulness", name: "# mindfulness", topic: "Meditation, journaling, gratitude", pinned: [], messages: [], professionalType: "counselor", category: "mental", group: "core" },
  { id: "stress", name: "# stress-management", topic: "Exam stress, time mgmt", pinned: [], messages: [], professionalType: "counselor", category: "mental", group: "core" },
  { id: "general-support", name: "# general-support", topic: "Open chat, other concerns", pinned: [], messages: [], professionalType: "counselor", category: "mental", group: "other" },
  // Physical health channels (doctors)
  { id: "injury-rehab", name: "# injury-rehab", topic: "Sprains, strains, recovery", pinned: [], messages: [], professionalPresent: true, professionalType: "doctor", category: "physical", group: "core" },
  { id: "chronic", name: "# chronic-conditions", topic: "Diabetes, asthma, thyroid", pinned: [], messages: [], professionalType: "doctor", category: "physical", group: "core" },
  { id: "nutrition", name: "# nutrition-fitness", topic: "Diet, gym, weight mgmt", pinned: [], messages: [], professionalType: "doctor", category: "physical", group: "core" },
  { id: "general-health", name: "# general-health", topic: "Other physical health topics", pinned: [], messages: [], professionalType: "doctor", category: "physical", group: "other" },
];

export default function CommunityHub() {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [category, setCategory] = useState<"mental" | "physical">("mental");
  const [activeId, setActiveId] = useState<string>(channels.find(c=>c.category==='mental')!.id);
  const [threadFor, setThreadFor] = useState<Message | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleChannels = useMemo(()=> channels.filter(c=>c.category===category), [channels, category]);
  const active = useMemo(()=> channels.find(c=>c.id===activeId)!, [channels, activeId]);
  const filteredMessages = useMemo(()=> {
    if(!query.trim()) return active.messages;
    return active.messages.filter(m=> m.text.toLowerCase().includes(query.toLowerCase()));
  }, [active, query]);

  function sendMessage() {
    const text = inputRef.current?.value?.trim();
    if(!text) return;
    const me: User = { id: "me", name: "You", role: "member", status: "online" };
    const msg: Message = { id: crypto.randomUUID(), user: me, text, ts: nowISO(), reactions: {}, replies: [] };
    setChannels(list => list.map(c => c.id===active.id ? { ...c, messages: [...c.messages, msg] } : c));
    if(inputRef.current) inputRef.current.value = "";
  }

  function addReaction(msgId: string, emoji: string){
    setChannels(list => list.map(c => c.id!==active.id ? c : {
      ...c,
      messages: c.messages.map(m => m.id!==msgId ? m : { ...m, reactions: { ...(m.reactions||{}), [emoji]: (m.reactions?.[emoji]||0)+1 } })
    }));
  }

  function pinMessage(msgId: string){
    setChannels(list => list.map(c => c.id!==active.id ? c : {
      ...c,
      messages: c.messages.map(m => m.id!==msgId ? m : { ...m, pinned: true })
    }));
  }

  function reportMessage(msgId: string){
    alert("Reported message " + msgId + " to moderators.");
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Sidebar */}
      <aside className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3">
        <Card className="bg-card border border-card-border h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><HeartHandshake className="w-4 h-4"/> Care & Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category switch */}
            <div className="flex gap-2">
              <button onClick={()=>{ setCategory('mental'); const first=channels.find(c=>c.category==='mental'); if(first) setActiveId(first.id); setThreadFor(null); }} className={`px-3 py-1 rounded-lg text-sm border ${category==='mental'?'bg-primary text-primary-foreground':'hover:bg-muted'}`}>Mental Health</button>
              <button onClick={()=>{ setCategory('physical'); const first=channels.find(c=>c.category==='physical'); if(first) setActiveId(first.id); setThreadFor(null); }} className={`px-3 py-1 rounded-lg text-sm border ${category==='physical'?'bg-primary text-primary-foreground':'hover:bg-muted'}`}>Physical Health</button>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Topics</div>
              {visibleChannels.filter(c=>c.group!=="other").map(c => (
                <button key={c.id} onClick={()=>{ setActiveId(c.id); setThreadFor(null); }} className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-left transition ${c.id===activeId? 'bg-primary/10 text-primary':'hover:bg-muted text-foreground'}`}>
                  <span className="flex items-center gap-2"><Hash className="w-4 h-4"/>{c.name.replace('# ','')}</span>
                  {c.professionalPresent && <Badge variant="secondary" className="text-xs">{c.professionalType==="doctor"? 'Doctor online':'Counselor online'}</Badge>}
                </button>
              ))}
              <div className="text-xs uppercase tracking-wide text-muted-foreground mt-3">Other</div>
              {visibleChannels.filter(c=>c.group==="other").map(c => (
                <button key={c.id} onClick={()=>{ setActiveId(c.id); setThreadFor(null); }} className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-left transition ${c.id===activeId? 'bg-primary/10 text-primary':'hover:bg-muted text-foreground'}`}>
                  <span className="flex items-center gap-2"><Hash className="w-4 h-4"/>{c.name.replace('# ','')}</span>
                  {c.professionalPresent && <Badge variant="secondary" className="text-xs">{c.professionalType==="doctor"? 'Doctor online':'Counselor online'}</Badge>}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Direct Messages</div>
              <button className="w-full px-2 py-2 rounded-lg hover:bg-muted flex items-center gap-2"><Users className="w-4 h-4"/> New message</button>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Guides</div>
              <button className="w-full px-2 py-2 rounded-lg hover:bg-muted flex items-center gap-2" onClick={()=>setShowRules(true)}><ShieldCheck className="w-4 h-4"/> Safety rules</button>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main chat area */}
      <main className="col-span-12 md:col-span-9 xl:col-span-9">
        <Card className="bg-card border border-card-border h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold flex items-center gap-2"><Hash className="w-4 h-4"/>{active.name}<span className="text-xs text-muted-foreground">{active.topic ? `• ${active.topic}`:''}</span></div>
                <div className="flex gap-2 mt-1">
                  {active.pinned.slice(0,3).map((p,i)=>(<a key={i} className="text-xs text-primary underline inline-flex items-center gap-1" href={p.url}><Pin className="w-3 h-3"/>{p.title}</a>))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative"><Search className="w-4 h-4 absolute left-2 top-2 text-muted-foreground"/><Input placeholder="Search messages" className="pl-7" value={query} onChange={e=>setQuery(e.target.value)} /></div>
                <Button variant="outline" size="sm" onClick={()=>setShowEvents(true)}><Calendar className="w-4 h-4 mr-1"/>Events</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-4">
              {/* Messages */}
              <div className={`col-span-12 ${threadFor? 'md:col-span-8':'col-span-12'}`}>
                <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
                  {filteredMessages.map(m=> (
                    <MessageRow key={m.id} msg={m} onReact={addReaction} onOpenThread={setThreadFor} onPin={pinMessage} onReport={reportMessage} />
                  ))}
                </div>

                {/* Composer */}
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="ghost" size="icon" title="Emoji"><Smile className="w-5 h-5"/></Button>
                  <Button variant="ghost" size="icon" title="Attach"><Paperclip className="w-5 h-5"/></Button>
                  <Button variant="ghost" size="icon" title="Voice note"><Mic className="w-5 h-5"/></Button>
                  <Input ref={inputRef} placeholder="Share support, ask a question..." className="flex-1"/>
                  <Button onClick={sendMessage}>Send</Button>
                </div>
              </div>

              {/* Thread */}
              {threadFor && (
                <aside className="hidden md:block md:col-span-4 border-l border-card-border pl-3">
                  <div className="text-sm font-medium mb-2">Thread</div>
                  <MessageRow msg={threadFor} onReact={addReaction} onOpenThread={()=>{}} onPin={pinMessage} onReport={reportMessage} />
                  <div className="mt-2 space-y-2">
                    {(threadFor.replies||[]).map(r => (<MessageRow key={r.id} msg={r} onReact={addReaction} onOpenThread={()=>{}} onPin={()=>{}} onReport={reportMessage}/>))}
                  </div>
                  <div className="mt-3">
                    <Input placeholder="Reply to thread..." onKeyDown={(e)=>{
                      if(e.key==='Enter'){
                        const text = (e.target as HTMLInputElement).value.trim();
                        if(!text) return;
                        const me: User = { id: "me", name: "You", role: "member", status: "online" };
                        const reply: Message = { id: crypto.randomUUID(), user: me, text, ts: nowISO() };
                        setChannels(list => list.map(c => c.id!==active.id ? c : ({
                          ...c,
                          messages: c.messages.map(m => m.id!==threadFor.id ? m : ({ ...m, replies: [...(m.replies||[]), reply] }))
                        })));
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}/>
                  </div>
                </aside>
              )}

            </div>
          </CardContent>
        </Card>
      </main>

      {/* Rules dialog */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Community Guidelines</DialogTitle></DialogHeader>
          <div className="text-sm text-muted-foreground space-y-2">
            <div>• Be kind and respectful. No harassment or hate speech.</div>
            <div>• This is a peer support space, not a substitute for professional care.</div>
            <div>• No sharing of personal identifying info. Use pseudonyms if you prefer.</div>
            <div>• If you see crisis signals, use the report button or visit the <a className="underline text-primary" href="/emergency">Emergency</a> page.</div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Events dialog */}
      <Dialog open={showEvents} onOpenChange={setShowEvents}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Upcoming Workshops & Seminars</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium">Events</div>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><span className="text-foreground">Yoga for Focus & Calm</span> — How yoga supports student mental health (Sat, 6:00 PM, online)</li>
                <li><span className="text-foreground">Beating Mental Fatigue</span> — Practical routines for study stamina (Wed, 7:00 PM, campus hall)</li>
                <li><span className="text-foreground">Mindfulness 101</span> — Guided breathing and grounding (Fri, 5:30 PM, online)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Recommended YouTube resources</div>
              <ul className="list-disc pl-5 space-y-1 text-primary">
                <li><a href="https://www.youtube.com/@Headspace" target="_blank" rel="noreferrer">Headspace — guided meditations & sleep</a></li>
                <li><a href="https://www.youtube.com/@Fittuber" target="blank" rel="noreferrer">Fit Tuber — Indian wellness & lifestyle tips</a></li>
                <li><a href="https://www.youtube.com/@YogaWithAdriene" target="_blank" rel="noreferrer">Yoga With Adriene — beginner-friendly yoga</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Self‑help books</div>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Atomic Habits — James Clear (daily habit systems)</li>
                <li>The Happiness Trap — Russ Harris (ACT-based tools)</li>
                <li>Why We Sleep — Matthew Walker (sleep & performance)</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RoleBadge({ role }: { role: Role }){
  const map: Record<Role, { label: string; className: string }> = {
    doctor: { label: "Doctor", className: "bg-emerald-600" },
    counselor: { label: "Counselor", className: "bg-blue-600" },
    mentor: { label: "Peer Mentor", className: "bg-purple-600" },
    admin: { label: "Admin", className: "bg-amber-600" },
    member: { label: "Member", className: "bg-muted text-foreground" },
  };
  const cfg = map[role];
  return <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${cfg.className}`}>{cfg.label}</span>;
}

function MessageRow({ msg, onReact, onOpenThread, onPin, onReport }:{ msg: Message; onReact: (id:string,e:string)=>void; onOpenThread: (m: Message)=>void; onPin:(id:string)=>void; onReport:(id:string)=>void; }){
  return (
    <div className="group p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-card-border transition">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary"/>
        <div className="text-sm font-medium">{msg.user.anonymous ? "Anonymous" : msg.user.name}</div>
        <RoleBadge role={msg.user.role} />
        <div className="text-[10px] text-muted-foreground">{new Date(msg.ts).toLocaleString()}</div>
        {msg.pinned && <Badge variant="secondary" className="text-[10px]">Pinned</Badge>}
      </div>
      <div className="text-sm mt-1 whitespace-pre-wrap">{msg.text}</div>
      <div className="mt-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <button className="text-xs text-muted-foreground hover:text-foreground" onClick={()=>onReact(msg.id,"👍")}>👍 {msg.reactions?.["👍"]||0}</button>
        <button className="text-xs text-muted-foreground hover:text-foreground" onClick={()=>onReact(msg.id,"💜")}>💜 {msg.reactions?.["💜"]||0}</button>
        <button className="text-xs text-muted-foreground hover:text-foreground" onClick={()=>onOpenThread(msg)}>Reply <ChevronRight className="w-3 h-3 inline"/></button>
        <button className="text-xs text-muted-foreground hover:text-foreground" onClick={()=>onPin(msg.id)}><Pin className="w-3 h-3 inline"/> Pin</button>
        <button className="text-xs text-red-600 hover:underline" onClick={()=>onReport(msg.id)}><Flag className="w-3 h-3 inline"/> Report</button>
      </div>
    </div>
  );
}
