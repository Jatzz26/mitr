import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HeartPulse, Activity, Shield, FolderLock, Languages, Radio, Rocket,
  Users, AlertTriangle, Droplet, Stethoscope, Cpu
} from "lucide-react";

// If a specific icon is not available in lucide-react in your version, it will gracefully render missing.
// You can swap icons easily by adjusting the imports above.

export default function InnovationHub() {
  const [lang, setLang] = useState<"en" | "hi">("en");

  const t = useMemo(() => {
    return lang === "hi"
      ? {
          title: "छात्र नवाचार एवं कल्याण केंद्र",
          subtitle:
            "MedTech • BioTech • HealthTech के अवसर — आत्मनिर्भर भारत के लिए",
          items: [
            {
              key: "dashboard",
              title: "डिजिटल हेल्थ डैशबोर्ड",
              desc: "त्वरित स्वयं-मूल्यांकन, अपॉइंटमेंट्स और दैनिक वेलनेस टिप्स।",
              icon: HeartPulse,
            },
            {
              key: "symptom",
              title: "लक्षण चेकर और वर्चुअल केयर असिस्टेंट",
              desc: "एआई-संचालित चैट प्रारम्भिक सलाह/त्रायेज के लिए।",
              icon: Stethoscope || Activity,
            },
            {
              key: "locker",
              title: "सिक्योर हेल्थ लॉकर (ABDM तैयार)",
              desc: "व्यक्तिगत स्वास्थ्य रिकॉर्ड सुरक्षित स्टोरेज और साझा करें।",
              icon: FolderLock,
            },
            {
              key: "lang",
              title: "क्षेत्रीय भाषा समर्थन",
              desc: "हिंदी व अन्य भारतीय भाषाएँ, ग्रामीण छात्रों के लिए ऑफ़लाइन एक्सेस।",
              icon: Languages,
            },
            {
              key: "iot",
              title: "IoT इंटीग्रेशन",
              desc: "वियरेबल्स, स्मार्ट डिवाइस और मेडिकल IoT टूल्स कनेक्ट करें।",
              icon: Radio,
            },
            {
              key: "launchpad",
              title: "इनोवेशन लॉन्चपैड",
              desc: "प्रतियोगिताएँ, सफलता की कहानियाँ, मेंटर और शोध संसाधन।",
              icon: Rocket,
            },
            {
              key: "community",
              title: "पीयर कम्युनिटी और सपोर्ट",
              desc: "चर्चा मंच, वॉलंटियर मौके, विशेषज्ञ Q&A।",
              icon: Users,
            },
            {
              key: "emergency",
              title: "आपातकाल और दान टूल्स",
              desc: "तेज़ हेल्पलाइन्स, रक्त/अंग दान ट्रैकिंग, हेल्थ एम्बेसडर नेटवर्क।",
              icon: AlertTriangle,
            },
          ],
        }
      : {
          title: "Student Innovation & Wellbeing Hub",
          subtitle:
            "MedTech • BioTech • HealthTech opportunities for Atmanirbhar Bharat",
          items: [
            {
              key: "dashboard",
              title: "Digital Health Dashboard",
              desc: "Self-assessments, appointments, and daily wellness tips.",
              icon: HeartPulse,
            },
            {
              key: "symptom",
              title: "Symptom Checker & Virtual Care Assistant",
              desc: "AI-powered chat for early advice or triage.",
              icon: Stethoscope || Activity,
            },
            {
              key: "locker",
              title: "Secure Health Locker (ABDM-ready)",
              desc: "Store, share, and control your personal health records.",
              icon: FolderLock,
            },
            {
              key: "lang",
              title: "Regional Language Support",
              desc: "Hindi and Indian languages; offline access for rural students.",
              icon: Languages,
            },
            {
              key: "iot",
              title: "IoT Integration",
              desc: "Connect wearables, smart devices, and medical IoT tools.",
              icon: Radio,
            },
            {
              key: "launchpad",
              title: "Innovation Launchpad",
              desc: "Student competitions, success stories, mentors, research.",
              icon: Rocket,
            },
            {
              key: "community",
              title: "Peer Community & Support",
              desc: "Forums, volunteering, and expert Q&A.",
              icon: Users,
            },
            {
              key: "emergency",
              title: "Emergency & Donation Tools",
              desc: "Crisis helplines, blood/organ donation, ambassador network.",
              icon: AlertTriangle,
            },
          ],
        };
  }, [lang]);

  return (
    <section aria-labelledby="innov-hub-heading" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header row with language toggle (does not alter branding) */}
        <div className="flex items-start sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 id="innov-hub-heading" className="text-2xl md:text-3xl font-bold text-foreground">
              {t.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")}>
              EN
            </Button>
            <Button size="sm" variant={lang === "hi" ? "default" : "outline"} onClick={() => setLang("hi")}>
              हिन्दी
            </Button>
          </div>
        </div>

        {/* Mega-menu style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.items.map((item) => {
            const Icon = item.icon || Cpu;
            return (
              <Card key={item.key} className="bg-card border border-card-border rounded-xl shadow-card h-full">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base md:text-lg text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Accessibility note */}
        <p className="sr-only">
          This section groups student-focused health tools into cards, optimized for keyboard and screen readers.
        </p>
      </div>
    </section>
  );
}
