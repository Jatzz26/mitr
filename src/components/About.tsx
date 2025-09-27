import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  const items = [
    {
      icon: Heart,
      title: "Care at the Core",
      desc: "We believe mental wellness is a daily practice. Our platform is designed to gently support, encourage reflection, and help you feel heard—anytime.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy First",
      desc: "Your space is confidential and secure. With anonymous options and robust protection, you stay in control of your information.",
    },
    {
      icon: Users,
      title: "Built for Students",
      desc: "Tailored to the unique challenges of higher education—exams, transitions, and campus life—with resources that truly fit your world.",
    },
    {
      icon: Sparkles,
      title: "Guided Growth",
      desc: "From AI assistance to journals and assessments, our tools are simple, effective, and crafted to help you build healthy habits.",
    },
  ];

  return (
    <section aria-labelledby="about-heading" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 id="about-heading" className="text-3xl md:text-4xl font-bold">About Us</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                MitR is a modern, student-first mental wellness platform. Our mission is to make
                support accessible, compassionate, and empowering—whether you're looking to talk,
                reflect, or learn.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We uphold three values: accessibility, privacy, and community. Every feature is
                designed to be inclusive and respectful, with clear choices and secure controls.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From quick check-ins to deeper sessions, we meet you where you are with gentle,
                helpful tools that fit your day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/resources')}>
                Learn More
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((it) => (
              <Card key={it.title} className="bg-card border border-card-border rounded-2xl transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-card">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <it.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{it.title}</div>
                    <p className="text-sm text-muted-foreground">{it.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
