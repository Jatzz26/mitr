import { MessageCircle, Users, Calendar, PenTool, BarChart3, Phone } from "lucide-react";
import FeatureCard from "./FeatureCard";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Chatbot Support",
      description: "Get instant, anonymous support through our multilingual AI chatbot. Available 24/7 with voice and text interactions.",
      action: "Start Chatting",
      gradient: false,
      solidColorHex: "#B39DDB", // Lavender
      solidTextOnColor: "light" as const,
    },
    {
      icon: Calendar,
      title: "Counselor Booking",
      description: "Book sessions with qualified mental health professionals. Completely confidential with secure anonymous communication.",
      action: "Book Session",
    },
    {
      icon: Users,
      title: "Peer Support Groups",
      description: "Connect with fellow students in moderated, anonymous group discussions. Share experiences and find community.",
      action: "Join Groups",
    },
    {
      icon: BarChart3,
      title: "Anxiety Assessment",
      description: "Take standardized tests to understand your mental health. Get personalized insights and track your progress over time.",
      action: "Take Assessment",
    },
    {
      icon: PenTool,
      title: "Personal Journaling",
      description: "Private space for reflection and mood tracking. Monitor your mental health journey with detailed analytics.",
      action: "Start Journaling",
    },
    {
      icon: Phone,
      title: "Emergency Support",
      description: "Quick access to crisis helplines and emergency resources. Get immediate help when you need it most.",
      action: "Get Help Now",
    },
  ];

  const navigate = useNavigate();

  return (
    <section id="features" className="py-20 bg-neutral-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Everything you need for
            <span className="text-transparent bg-gradient-primary bg-clip-text block">
              mental wellness
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive mental health support designed specifically for the unique challenges of higher education.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              action={feature.action}
              gradient={feature.gradient}
              onClick={() => {
                const title = feature.title;
                const path =
                  title === "AI Chatbot Support" ? "/chatbot" :
                  title === "Counselor Booking" ? "/booking" :
                  title === "Peer Support Groups" ? "/groups" :
                  title === "Anxiety Assessment" ? "/assessment" :
                  title === "Personal Journaling" ? "/journal" :
                  title === "Emergency Support" ? "/resources" : "/";
                navigate(path);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;