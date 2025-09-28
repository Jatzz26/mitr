import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, HeartPulse, Users, BookOpen, Shield, Cpu, Rocket, Stethoscope, Radio } from "lucide-react";

const items = [
  {
    key: "assessment",
    title: "Assessment",
    desc: "Quick self-checks to understand your wellbeing.",
    to: "/assessment",
    icon: HeartPulse,
    emoji: "🧠",
  },
  {
    key: "resources",
    title: "Resources",
    desc: "Tips, guides, and curated tools to help you thrive.",
    to: "/resources",
    icon: BookOpen,
    emoji: "📚",
  },
  {
    key: "counsellors",
    title: "Counsellors",
    desc: "Reach out to experts for support and guidance.",
    to: "/counsellors",
    icon: Users,
    emoji: "🧑‍⚕️",
  },
  {
    key: "locker",
    title: "Health Locker (ABDM)",
    desc: "Store and share your health records securely.",
    to: "/locker",
    icon: Shield,
    emoji: "🗄️",
  },
  {
    key: "devices",
    title: "IoT Devices",
    desc: "Connect wearables and smart health devices.",
    to: "/devices",
    icon: Radio,
    emoji: "⌚",
  },
  {
    key: "innovation",
    title: "Innovation Launchpad",
    desc: "Competitions, mentors, and research links.",
    to: "/innovation",
    icon: Rocket,
    emoji: "🚀",
  },
  {
    key: "community",
    title: "Community",
    desc: "Forums, volunteering, and peer support.",
    to: "/community",
    icon: GraduationCap,
    emoji: "🤝",
  },
  {
    key: "symptom",
    title: "Symptom Checker",
    desc: "AI triage via chatbot to get early advice.",
    to: "/symptom-checker",
    icon: Stethoscope,
    emoji: "🩺",
  },
];

export default function ForStudents() {
  return (
    <section aria-labelledby="for-students-heading" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center space-y-2">
          <h2 id="for-students-heading" className="text-3xl font-bold text-foreground">
            For Students
          </h2>
          <p className="text-muted-foreground">Everything you need in one place — wellbeing, care, innovation, and community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ key, title, desc, to, icon: Icon, emoji }) => (
            <Card key={key} className="bg-card border border-card-border rounded-xl shadow-card group hover:shadow-lg transition-shadow">
              <CardHeader className="flex items-center gap-3 pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <span>{title}</span>
                  <span className="text-xl" aria-hidden>{emoji}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-muted-foreground min-h-[40px]">{desc}</p>
                <Button asChild size="sm" className="rounded-lg">
                  <Link to={to}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
