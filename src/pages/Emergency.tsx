import { Phone, AlertTriangle, Shield, MapPin, Users, HeartHandshake } from "lucide-react";

export default function Emergency() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Emergency Help</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            If you or someone you know is in immediate danger, please contact local emergency services right away. The resources below can help you find urgent support.
          </p>
        </div>

        {/* Immediate actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="tel:112" className="group rounded-xl border border-card-border bg-card p-5 shadow-card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold">Call Emergency (112)</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">India's national emergency number</p>
          </a>

          <a href="tel:9152987821" className="group rounded-xl border border-card-border bg-card p-5 shadow-card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-semibold">Suicide Prevention (AASRA)</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">24x7 Helpline: 91-22-27546669 • WhatsApp: 9152987821</p>
          </a>

          <a href="https://health.ndtv.com/health-news/mental-health-helplines-in-india-list-2294030" target="_blank" rel="noreferrer" className="group rounded-xl border border-card-border bg-card p-5 shadow-card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-semibold">Verified Helplines</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">View a list of regional mental health helplines</p>
          </a>
        </section>

        {/* Campus / Local support */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-card-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Campus Support</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Counseling Center: +91-XXXXXXXXXX</li>
              <li>Campus Security: +91-XXXXXXXXXX</li>
              <li>Student Affairs Office: +91-XXXXXXXXXX</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">Replace placeholders with your institution's contacts.</p>
          </div>

          <div className="rounded-xl border border-card-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Near You</h3>
            </div>
            <p className="text-sm text-muted-foreground">Find nearby hospitals and clinics via Google Maps.</p>
            <div className="mt-3 flex gap-2">
              <a className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/hospital+near+me">Hospitals near me</a>
              <a className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/mental+health+clinic+near+me">Mental health clinics</a>
            </div>
          </div>
        </section>

        {/* Community & Donation */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-card-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <HeartHandshake className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Community Support</h3>
            </div>
            <p className="text-sm text-muted-foreground">Join local volunteers or peer support groups.</p>
            <div className="mt-3 flex gap-2">
              <a className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm" href="/community">Explore community</a>
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <HeartHandshake className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Blood/Organ Donation</h3>
            </div>
            <p className="text-sm text-muted-foreground">Learn how to register and help others in need.</p>
            <div className="mt-3 flex gap-2">
              <a className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm" target="_blank" rel="noreferrer" href="https://www.eraktkosh.in/BLDAHIMS/bloodbank/nearbyBBRed.cnt">Find Blood Banks</a>
              <a className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm" target="_blank" rel="noreferrer" href="https://notto.gov.in/">Organ Donation</a>
            </div>
          </div>
        </section>

        <p className="text-xs text-muted-foreground text-center">
          Disclaimer: The information on this page is for support and guidance. If you are in imminent danger, contact local emergency services immediately.
        </p>
      </div>
    </div>
  );
}
