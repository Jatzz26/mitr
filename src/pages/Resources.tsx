import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, ExternalLink, Bookmark, BookmarkCheck, Search, Star, Headphones, Film, FileText, Sparkles } from "lucide-react";

type Resource = {
  id: string;
  type: "article" | "video" | "audio" | "tool" | "ai";
  title: string;
  description: string;
  url?: string; // external link
  embed?: string; // iframe src
  tags?: string[];
  rating?: number; // 0-5
  thumbnail?: string;
};

const DATA: Resource[] = [
  { id: "a1", type: "article", title: "Mindful Breathing Basics", description: "A short guide to get started with mindful breathing in 5 minutes.", url: "https://www.mindful.org/meditation/mindfulness-getting-started/", tags: ["mindfulness","breathing"], rating: 4.6 },
  { id: "v1", type: "video", title: "5-minute Guided Relaxation", description: "Quick mid-day reset to reduce stress.", embed: "https://www.youtube.com/embed/inpok4MKVLM", tags: ["relaxation","guided"], rating: 4.8 },
  { id: "t1", type: "tool", title: "Box Breathing Timer", description: "Interactive 4-4-4-4 breathing cycle.", url: "https://boxbreathing.org/", tags: ["tool","breathing"], rating: 4.5 },
  { id: "ai1", type: "ai", title: "AI Coping Strategies", description: "Ask the AI for personalized coping strategies.", url: "/chatbot", tags: ["ai","coping"], rating: 4.4 },
  { id: "j1", type: "article", title: "Journaling Prompts for Clarity", description: "20 prompts to reflect and gain clarity.", url: "https://www.healthline.com/health/mental-health/journaling-for-mental-health", tags: ["journaling","prompts"], rating: 4.7 },
  { id: "au1", type: "audio", title: "Calming Ocean Waves", description: "10-minute ambient audio for focus.", url: "https://soundcloud.com/search?q=ocean%20waves", tags: ["audio","focus"], rating: 4.2 },
];

const CATEGORY_TABS = [
  { key: "all", label: "All" },
  { key: "article", label: "Articles", icon: FileText },
  { key: "video", label: "Videos", icon: Film },
  { key: "audio", label: "Audio", icon: Headphones },
  { key: "tool", label: "Tools", icon: Sparkles },
  { key: "ai", label: "AI Assistance", icon: Sparkles },
];

export default function Resources() {
  const [tab, setTab] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("resource_bookmarks") || "[]"); } catch { return []; }
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = DATA.filter(r => tab === "all" || r.type === tab);
    if (q) arr = arr.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || (r.tags||[]).some(t => t.toLowerCase().includes(q)));
    if (sort === "popular") arr = arr.sort((a,b) => (b.rating||0) - (a.rating||0));
    if (sort === "recent") arr = arr.slice(); // placeholder if we add dates later
    return arr;
  }, [tab, query, sort]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("resource_bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const renderCard = (r: Resource) => (
    <Card key={r.id} className="bg-card border border-card-border rounded-2xl overflow-hidden group">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-lg leading-snug">{r.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{r.description}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {(r.tags || []).map(t => (
              <Badge key={t} variant="secondary" className="rounded-full text-[10px]">{t}</Badge>
            ))}
          </div>
        </div>
        <button aria-label={bookmarks.includes(r.id) ? "Remove bookmark" : "Bookmark"} onClick={() => toggleBookmark(r.id)} className="p-2 rounded-md border border-card-border hover:bg-muted transition-colors">
          {bookmarks.includes(r.id) ? <BookmarkCheck className="w-4 h-4"/> : <Bookmark className="w-4 h-4"/>}
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        {r.embed && (
          <div className="aspect-video rounded-xl overflow-hidden border border-card-border">
            <iframe
              title={r.title}
              src={r.embed}
              loading="lazy"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground" aria-label={`Rating ${r.rating ?? 0} out of 5`}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{r.rating?.toFixed(1) ?? "-"}</span>
          </div>
          {r.url && (
            <Button size="sm" onClick={() => window.open(r.url!, r.url!.startsWith("/") ? "_self" : "_blank")}>
              {r.type === "video" ? <Play className="w-4 h-4 mr-2"/> : <ExternalLink className="w-4 h-4 mr-2"/>}
              {r.type === "video" ? "Play" : "Open"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        {/* Sticky page header */}
        <div className="sticky top-[64px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-card-border mb-6">
          <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Resources</h1>
              <p className="text-muted-foreground">Curated guides, videos, tools and AI assistance to support your wellness journey.</p>
            </div>
            <div className="flex gap-2">
              <div className="relative w-72 max-w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input aria-label="Search resources" placeholder="Search by keyword or tag" value={query} onChange={(e)=>setQuery(e.target.value)} className="pl-9 rounded-xl" />
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Sort"/></SelectTrigger>
                <SelectContent className="bg-card text-foreground border border-card-border shadow-card">
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="recent">Most recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={tab} onValueChange={setTab} className="pb-3">
            <TabsList className="bg-card border border-card-border rounded-xl p-1">
              {CATEGORY_TABS.map(t => (
                <TabsTrigger key={t.key} value={t.key} className="rounded-lg data-[state=active]:bg-muted">
                  {t.icon ? <t.icon className="w-4 h-4 mr-1"/> : null}
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(renderCard)}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">No resources found. Try different filters.</div>
          )}
        </div>

        {/* Emergency contacts as a distinct section */}
        <div className="mt-10">
          <Card className="bg-card border border-card-border rounded-2xl">
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[{ name: "AASRA", number: "91-22-27546669", url: "tel:91-22-27546669" },
                { name: "iCall", number: "022-25521111", url: "tel:022-25521111" },
                { name: "Snehi", number: "011-65978181", url: "tel:011-65978181" },
                { name: "Kiran (24x7)", number: "1800-599-0019", url: "tel:1800-599-0019" }].map((i) => (
                <div key={i.name} className="border border-card-border rounded-xl p-4 bg-card">
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{i.number}</div>
                  <div className="flex gap-2">
                    <Button onClick={() => window.open(i.url, "_self")}>Call</Button>
                    <Button variant="outline" onClick={() => window.open(`sms:${i.number}`)}>SMS</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


