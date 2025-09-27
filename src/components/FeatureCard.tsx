import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  onClick?: () => void;
  gradient?: boolean;
  solidColorHex?: string; // when provided, use solid color background
  solidTextOnColor?: 'light' | 'dark'; // adjust text contrast
}

const FeatureCard = ({ icon: Icon, title, description, action, onClick, gradient = false, solidColorHex, solidTextOnColor = 'light' }: FeatureCardProps) => {
  const useSolid = Boolean(solidColorHex);
  const solidText = solidTextOnColor === 'light' ? 'text-white' : 'text-foreground';
  return (
    <div
      className={`
        group p-6 rounded-2xl border ${useSolid ? 'border-transparent' : 'border-card-border'}
        ${useSolid ? '' : 'bg-card hover:shadow-card'} transition-smooth cursor-pointer
        ${gradient && !useSolid ? 'bg-gradient-accent text-accent-foreground' : (!useSolid ? 'hover:border-primary/20' : '')}
      `}
      style={useSolid ? { backgroundColor: solidColorHex } : undefined}
    >
      <div className="space-y-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center transition-smooth
          ${useSolid
            ? 'bg-white/20'
            : gradient
              ? 'bg-white/20'
              : 'bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground'}
        `}>
          <Icon className={`w-6 h-6 ${useSolid ? solidText : ''}`} />
        </div>
        
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${useSolid ? solidText : ''}`}>{title}</h3>
          <p className={`text-sm leading-relaxed ${useSolid ? `${solidText} opacity-90` : (gradient ? 'text-accent-foreground/80' : 'text-muted-foreground')}`}>
            {description}
          </p>
        </div>
        
        <Button 
          variant={useSolid ? "secondary" : (gradient ? "secondary" : "ghost")}
          className={`
            w-full justify-start p-0 h-auto font-medium transition-smooth
            ${useSolid 
              ? `${solidText} hover:opacity-90`
              : (gradient 
                ? 'text-accent-foreground hover:text-accent-foreground/80' 
                : 'text-primary hover:text-primary-dark')}
          `}
          onClick={onClick}
        >
          {action} →
        </Button>
      </div>
    </div>
  );
};

export default FeatureCard;