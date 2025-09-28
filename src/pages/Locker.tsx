import HealthLocker from "@/components/locker/HealthLocker";
import { CheckCircle2, Shield, Lock } from "lucide-react";

export default function Locker() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Hero-like header to fill space */}
        <section className="text-center space-y-3 pt-2">
          <div className="mx-auto flex items-center justify-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Health Locker</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Secure personal health records with consent-based AI insights (ABDM-ready). Manage, analyze, and chat about your reports—privately.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary"/> Consent-first processing</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary"/> Encrypted storage</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary"/> AI summaries & charts</span>
          </div>
        </section>
        <HealthLocker />
      </div>
    </div>
  );
}
