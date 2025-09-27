import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import EmergencySection from "@/components/EmergencySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Benefits />
      <Features />
      <EmergencySection />
    </div>
  );
};

export default Index;
