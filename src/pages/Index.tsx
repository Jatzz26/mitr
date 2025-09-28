import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import EmergencySection from "@/components/EmergencySection";
import InnovationHub from "@/components/InnovationHub";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      {/* Student Innovation & Wellbeing Hub (MedTech/BioTech/HealthTech) */}
      <InnovationHub />
      <Benefits />
      <Features />
      <EmergencySection />
    </div>
  );
};

export default Index;
