import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-mental-health.jpg";
import ReleaseLetGo from "@/components/ReleaseLetGo";

const Hero = () => {
  const navigate = useNavigate();
  const [rlgOpen, setRlgOpen] = useState(false);

  return (
    <section className="min-h-screen bg-gradient-calm flex items-center pt-2 pb-16 md:pt-4 md:pb-20" aria-labelledby="hero-heading">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Your mental health,
                <span className="text-transparent bg-gradient-accent bg-clip-text block">
                  our priority
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Anonymous, accessible mental health support designed specifically for higher education students. 
                Get help when you need it, how you need it.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-neutral-light px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-neutral-foreground">100% Anonymous</span>
              </div>
              <div className="flex items-center space-x-2 bg-neutral-light px-4 py-2 rounded-full">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-neutral-foreground">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 bg-neutral-light px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-neutral-foreground">Peer Community</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-soft text-lg px-8 py-4"
                onClick={() => navigate("/signup")}
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth text-lg px-8 py-4"
                onClick={() => setRlgOpen(true)}
              >
                Release & Let Go
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-card-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available Support</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-card">
              <img 
                src={heroImage} 
                alt="Peaceful mental health support illustration" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card border border-card-border rounded-xl p-4 shadow-card">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm font-medium text-card-foreground">Online Counselors</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-card border border-card-border rounded-xl p-4 shadow-card">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-card-foreground">Safe Space</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReleaseLetGo open={rlgOpen} onClose={() => setRlgOpen(false)} />
    </section>
  );
};

export default Hero;