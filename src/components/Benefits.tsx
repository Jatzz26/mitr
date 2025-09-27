import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Sparkles, Clock, Globe2 } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Confidential & Safe", desc: "Anonymous by default with secure, private sessions and data." },
  { icon: Sparkles, title: "Personalized Support", desc: "Tailored guidance, assessments and tools for your needs." },
  { icon: Clock, title: "Always Available", desc: "Get help anytime with 24/7 access to tools and support." },
  { icon: Globe2, title: "Multilingual", desc: "Chat and resources available in multiple languages." },
];

export default function Benefits() {
  return (
    <section aria-labelledby="benefits-heading" className="py-16">
      <div className="container mx-auto px-4">
        <h2 id="benefits-heading" className="text-3xl md:text-4xl font-bold text-center mb-10">Why choose MitR</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((b) => (
            <Card key={b.title} className="bg-card border border-card-border rounded-2xl transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-card">
              <CardContent className="p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">{b.title}</div>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
