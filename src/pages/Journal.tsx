import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { Search, Plus, Trash2, Save, CalendarClock, Eye, EyeOff, Type, Bold, Italic, List, Tag, Bell } from "lucide-react";

type Entry = { id: string; title: string; content: string; created_at?: string; book?: string | null; tags?: string[] | null };

const DEFAULT_BOOKS = ["Daily Log", "Wellness Journal", "Mood Tracker"];

function formatNow() {
  const d = new Date();
  return d.toLocaleString();
}

function renderMarkdownBasic(md: string) {
  // Very lightweight markdown rendering: **bold**, *italics*, - list
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Lists: lines starting with - or *
  const lines = html.split(/\n/);
  const out: string[] = [];
  let inList = false;
  for (const line of lines) {
    const match = line.match(/^[-*]\s+(.*)/);
    if (match) {
      if (!inList) {
        inList = true;
        out.push("<ul style=\"list-style: disc; padding-left: 1.25rem;\">");
      }
      out.push(`<li>${match[1]}</li>`);
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<p>${line || "&nbsp;"}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

export default function Journal() {
  const { user } = useAuth();
  const { toast } = useToast();
  // Sidebar books
  const [books, setBooks] = useState<string[]>(DEFAULT_BOOKS);
  const [activeBook, setActiveBook] = useState<string>(books[0]);
  const [newBookName, setNewBookName] = useState("");

  // Entries & editor
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchText, setSearchText] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currentEntry = entries.find(e => e.id === selectedId) || null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string>(""); // comma-separated
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reminders, setReminders] = useState<boolean>(() => localStorage.getItem("journal_reminders") === "true");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const filteredEntries = useMemo(() => {
    const t = searchText.trim().toLowerCase();
    const tag = tagFilter.trim().toLowerCase();
    return entries
      .filter(e => (activeBook ? (e.book ?? "") === activeBook : true))
      .filter(e => !t || e.title.toLowerCase().includes(t) || e.content.toLowerCase().includes(t))
      .filter(e => {
        if (!tag) return true;
        const arr = (e.tags ?? []).map(x => x.toLowerCase());
        return arr.includes(tag);
      })
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
  }, [entries, searchText, tagFilter, activeBook]);

  useEffect(() => {
    if (!user) return;
    loadBooks();
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeBook]);

  const loadBooks = async () => {
    // Attempt to pull distinct books from DB if column exists
    try {
      const { data, error } = await supabase
        .from("journals")
        .select("book")
        .eq("user_id", user?.id);
      if (!error && data) {
        const distinct = Array.from(new Set((data as any[]).map(x => x.book).filter(Boolean)));
        if (distinct.length) setBooks(prev => Array.from(new Set([...distinct, ...prev])));
      }
    } catch {
      // ignore
    }
  };

  const loadEntries = async () => {
    if (!user) return;
    const cols = "id, title, content, created_at, book, tags";
    let res = await supabase.from("journals").select(cols).eq("user_id", user.id).order("created_at", { ascending: false });
    if (res.error && /column .* book/.test(res.error.message)) {
      // Fallback without optional columns
      res = await supabase.from("journals").select("id, title, content, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
    }
    setEntries(((res.data as any) ?? []).map((e: any) => ({ ...e, book: e.book ?? books[0], tags: e.tags ?? [] })));
  };

  const resetEditor = () => {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setTags("");
  };

  const newEntry = () => {
    resetEditor();
    setTitle("");
    setContent("");
  };

  const insertAtCursor = (before: string, after = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const val = content;
    const selected = val.substring(start, end);
    const updated = val.substring(0, start) + before + selected + after + val.substring(end);
    setContent(updated);
    requestAnimationFrame(() => {
      const pos = start + before.length + selected.length + after.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const saveEntry = async () => {
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast({ title: "Title and content required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const tagsArr = tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      const base: any = {
        user_id: user.id,
        title: title.trim(),
        content: content,
      };
      if (activeBook) base.book = activeBook;
      if (tagsArr.length) base.tags = tagsArr;

      if (!selectedId) {
        // Insert
        let { error } = await supabase.from("journals").insert(base);
        if (error && /column .* book/.test(error.message)) {
          // Retry without optional cols
          const { error: e2 } = await supabase.from("journals").insert({ user_id: user.id, title: base.title, content: base.content } as any);
          error = e2 as any;
        }
        if (error) throw error;
        toast({ title: "Entry saved" });
      } else {
        // Update
        let { error } = await supabase.from("journals").update(base).eq("id", selectedId).eq("user_id", user.id);
        if (error && /column .* book/.test(error.message)) {
          const { error: e2 } = await supabase.from("journals").update({ title: base.title, content: base.content } as any).eq("id", selectedId).eq("user_id", user.id);
          error = e2 as any;
        }
        if (error) throw error;
        toast({ title: "Entry updated" });
      }
      await loadEntries();
      resetEditor();
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const editEntry = (e: Entry) => {
    setSelectedId(e.id);
    setTitle(e.title);
    setContent(e.content);
    setTags((e.tags ?? []).join(", "));
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    await supabase.from("journals").delete().eq("id", id).eq("user_id", user.id);
    await loadEntries();
    if (selectedId === id) resetEditor();
  };

  const toggleReminders = () => {
    const next = !reminders;
    setReminders(next);
    localStorage.setItem("journal_reminders", String(next));
    if (next && "Notification" in window) {
      // Request permission non-blocking
      try { (Notification as any).requestPermission?.(); } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          {/* Sidebar: Journals */}
          <Card className="bg-card border border-card-border rounded-2xl h-max">
            <CardHeader>
              <CardTitle className="text-lg">Your Journals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2">
                {books.map((b) => (
                  <button
                    key={b}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                      b === activeBook ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-card-border bg-card hover:bg-muted"
                    }`}
                    onClick={() => setActiveBook(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-card-border">
                <Label htmlFor="newbook" className="text-sm">New Journal</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="newbook" placeholder="e.g. Gratitude" value={newBookName} onChange={e=>setNewBookName(e.target.value)} />
                  <Button
                    onClick={() => {
                      const name = newBookName.trim();
                      if (!name) return;
                      if (!books.includes(name)) setBooks([name, ...books]);
                      setActiveBook(name);
                      setNewBookName("");
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="pt-2 border-t border-card-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily reminders</span>
                  <Button variant="outline" size="sm" onClick={toggleReminders}>
                    <Bell className="w-4 h-4 mr-1" /> {reminders ? "On" : "Off"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">We’ll remind you once a day to write. Enable notifications in your browser.</p>
              </div>
              <div className="pt-2 border-t border-card-border">
                <p className="text-xs text-muted-foreground">Your entries are private and secure. Only you can access them.</p>
              </div>
            </CardContent>
          </Card>

          {/* Main area */}
          <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-4">
            {/* Entries list */}
            <Card className="bg-card border border-card-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{activeBook}</span>
                  <Button size="sm" onClick={newEntry}><Plus className="w-4 h-4 mr-1"/> New Entry</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search entries" value={searchText} onChange={e=>setSearchText(e.target.value)} />
                  </div>
                  <div className="relative w-40">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Tag" value={tagFilter} onChange={e=>setTagFilter(e.target.value)} />
                  </div>
                </div>
                <div className="max-h-[60vh] overflow-auto divide-y divide-card-border rounded-lg border border-card-border">
                  {filteredEntries.map(e => (
                    <button key={e.id} onClick={() => editEntry(e)} className="w-full text-left p-3 hover:bg-muted">
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate">{e.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarClock className="w-3.5 h-3.5" />
                          {new Date(e.created_at ?? '').toLocaleString()}
                        </div>
                      </div>
                      {e.tags && e.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {e.tags.map(t => <Badge key={t} variant="secondary" className="rounded-full text-[10px]">{t}</Badge>)}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.content}</p>
                    </button>
                  ))}
                  {filteredEntries.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground">No entries yet. Create your first entry.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Editor */}
            <Card className="bg-card border border-card-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{selectedId ? "Edit Entry" : "New Entry"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="A moment from today" value={title} onChange={e=>setTitle(e.target.value)} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Timestamp: {formatNow()}</span>
                    <span>{activeBook}</span>
                  </div>
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-card-border bg-background">
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertAtCursor("**","**")}><Bold className="w-4 h-4"/></Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertAtCursor("*","*")}><Italic className="w-4 h-4"/></Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertAtCursor("- ")}><List className="w-4 h-4"/></Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertAtCursor("# ")}><Type className="w-4 h-4"/></Button>
                    <div className="ml-auto flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setPreview(p=>!p)}>
                        {preview ? <><EyeOff className="w-4 h-4 mr-1"/> Hide Preview</> : <><Eye className="w-4 h-4 mr-1"/> Show Preview</>}
                      </Button>
                    </div>
                  </div>
                  {!preview ? (
                    <textarea
                      ref={textareaRef}
                      className="w-full rounded-xl border border-input-border bg-background p-3 min-h-[280px]"
                      placeholder="Write your thoughts... Use **bold**, *italics*, and - lists"
                      value={content}
                      onChange={e=>setContent(e.target.value)}
                    />
                  ) : (
                    <div className="p-4 rounded-xl border border-card-border bg-background min-h-[280px] prose prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownBasic(content) }} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" placeholder="comma,separated,tags" value={tags} onChange={e=>setTags(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Use tags to organize entries. Example: gratitude, sleep, study</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={saveEntry} disabled={saving}><Save className="w-4 h-4 mr-1"/>{saving ? "Saving..." : (selectedId ? "Update Entry" : "Save Entry")}</Button>
                  {selectedId && (
                    <Button variant="destructive" onClick={() => deleteEntry(selectedId!)}><Trash2 className="w-4 h-4 mr-1"/>Delete</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


