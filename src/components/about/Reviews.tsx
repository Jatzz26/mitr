import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export type Review = {
  id: string;
  name: string;
  program: string;
  avatar?: string;
  rating: number; // 1-5
  text: string;
};

const sample: Review[] = [
  { id: "r1", name: "Ananya", program: "B.Tech, 3rd year", rating: 5, text: "mitr helped me manage exam stress and sleep better. The chatbot and journals are amazing." },
  { id: "r2", name: "Raghav", program: "MBA, 1st year", rating: 4, text: "I like the resources and community. The assessments gave me a clear starting point." },
  { id: "r3", name: "Sara", program: "BA Psychology", rating: 5, text: "The design feels safe and supportive. Anonymous options made it easy to open up." },
  { id: "r4", name: "Kabir", program: "BSc", rating: 4, text: "Insights from my reports were easy to understand. Looking forward to more features." },
  { id: "r5", name: "Meera", program: "M.Tech", rating: 5, text: "Love the clean UI and quick access to help when needed." },
];

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState<Review[]>(sample);
  const page = useMemo(() => items.slice(index, index + 3), [items, index]);
  const canPrev = index > 0;
  const canNext = index + 3 < items.length;

  // Attempt to load reviews from Supabase if the table exists
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("reviews").select("id,name,program,rating,text").order("created_at", { ascending: false }).limit(12);
        if (!error && Array.isArray(data) && data.length) {
          setItems(data as any);
        }
      } catch {}
    })();
  }, []);

  // Feedback form state
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    const newItem: Review = { id: crypto.randomUUID(), name: name || "Anonymous", program: program || "Student", rating, text };
    try {
      // Optimistic UI update
      setItems((arr) => [newItem, ...arr]);
      setIndex(0);
      // Persist to Supabase if table exists
      await supabase.from("reviews").insert({ name: newItem.name, program: newItem.program, rating: newItem.rating, text: newItem.text });
    } catch {}
    finally {
      setSubmitting(false);
      setName(""); setProgram(""); setRating(5); setText("");
    }
  }

  return (
    <section className="py-10" aria-labelledby="reviews-heading">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 id="reviews-heading" className="text-2xl font-bold">What students say</h3>
          <div className="flex gap-2">
            <button disabled={!canPrev} onClick={()=>setIndex(i=>Math.max(0,i-1))} className={`px-3 py-1 rounded-lg border ${canPrev? 'hover:bg-muted':'opacity-50 cursor-not-allowed'}`}>Prev</button>
            <button disabled={!canNext} onClick={()=>setIndex(i=>Math.min(items.length-3, i+1))} className={`px-3 py-1 rounded-lg border ${canNext? 'hover:bg-muted':'opacity-50 cursor-not-allowed'}`}>Next</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {page.map((r)=> (
            <Card key={r.id} className="rounded-2xl bg-card border border-card-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.program}</div>
                  </div>
                </div>
                <Stars rating={r.rating} />
                <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Feedback */}
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-2">Share your feedback</h4>
          <form onSubmit={submitFeedback} className="grid md:grid-cols-4 gap-3">
            <Input placeholder="Your name (optional)" value={name} onChange={(e)=>setName(e.target.value)} />
            <Input placeholder="Program / Year" value={program} onChange={(e)=>setProgram(e.target.value)} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div className="md:col-span-4">
              <textarea placeholder="Your feedback..." value={text} onChange={(e)=>setText(e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-background" rows={3} />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Feedback'}</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }){
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'opacity-30'}`} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }:{ value: number; onChange: (n:number)=>void }){
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <button type="button" key={i} onClick={()=>onChange(i+1)}>
          <Star className={`w-5 h-5 ${i < value ? 'fill-current' : 'opacity-30'}`} />
        </button>
      ))}
    </div>
  );
}
