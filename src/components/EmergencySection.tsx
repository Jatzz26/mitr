import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Globe } from "lucide-react";

const EmergencySection = () => {
  const helplines = [
    {
      name: "AASRA",
      number: "91-22-27546669",
      description: "24x7 Crisis Helpline",
      icon: Phone,
    },
    {
      name: "iCall",
      number: "022-25521111",
      description: "Psychosocial Helpline",
      icon: MessageSquare,
    },
    {
      name: "Snehi",
      number: "011-65978181",
      description: "Crisis Prevention",
      icon: Globe,
    },
  ];

  return (
    <section className="py-20" style={{ backgroundColor: 'hsl(var(--accent))' }}>
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'hsl(var(--accent-foreground))' }}>
            Need immediate help?
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'hsl(var(--accent-foreground))', opacity: 0.9 }}>
            If you're experiencing a mental health crisis, these resources are available 24/7. 
            You're not alone, and help is just a call away.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {helplines.map((helpline, index) => (
            <div 
              key={index}
              className="rounded-2xl p-6 text-center space-y-4 bg-card border border-card-border shadow-card"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'hsl(var(--accent-muted))' }}>
                <helpline.icon className="w-8 h-8" style={{ color: 'hsl(var(--accent))' }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{helpline.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{helpline.description}</p>
                <Button onClick={() => window.open(`tel:${helpline.number}`, '_self')}>
                  <Phone className="w-4 h-4 mr-2" />
                  {helpline.number}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm mb-4" style={{ color: 'hsl(var(--accent-foreground))', opacity: 0.9 }}>
            Remember: Seeking help is a sign of strength, not weakness.
          </p>
          <Button size="lg" variant="secondary" className="bg-background text-foreground border-card-border hover:bg-muted" onClick={() => window.location.assign('/resources')}>
            View All Resources
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EmergencySection;