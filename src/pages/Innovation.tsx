import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rocket, Users, Trophy, BookOpen, Calendar, Star, Sparkles, FolderKanban } from "lucide-react";

export default function Innovation() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary">
            <Rocket className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Innovation Launchpad</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Student competitions, mentors, success stories, and research resources — a home for health & wellbeing innovation on campus.
          </p>
        </header>

        {/* Current features */}
        <section aria-labelledby="current-features" className="space-y-3">
          <h2 id="current-features" className="text-xl font-semibold">Explore</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard icon={<Trophy className='w-5 h-5'/>} title="Student Competitions" desc="Participate in healthtech hackathons and idea challenges." />
            <FeatureCard icon={<Users className='w-5 h-5'/>} title="Mentors Directory" desc="Find mentors across medicine, design, and engineering." />
            <FeatureCard icon={<Star className='w-5 h-5'/>} title="Success Stories" desc="Read how students turned ideas into impact." />
            <FeatureCard icon={<BookOpen className='w-5 h-5'/>} title="Research Resources" desc="Access papers, datasets, and starter toolkits." />
          </div>
        </section>

        {/* Coming soon */}
        <section aria-labelledby="coming-soon" className="space-y-3">
          <div className="rounded-2xl border border-card-border bg-gradient-to-r from-primary/5 to-accent/5 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5"/>
              </div>
              <div className="flex-1">
                <h2 id="coming-soon" className="text-lg font-semibold">Coming soon</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  <SoonPill icon={<Calendar className='w-4 h-4'/>} label="Upcoming Events" />
                  <SoonPill icon={<Users className='w-4 h-4'/>} label="Mentor Directory Expansion" />
                  <SoonPill icon={<FolderKanban className='w-4 h-4'/>} label="Project Showcases" />
                  <SoonPill icon={<Star className='w-4 h-4'/>} label="Grants & Funding" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">We’re actively building these features. Tell us what you’d like to see first below.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Signup */}
        <section aria-labelledby="signup" className="space-y-3">
          <h2 id="signup" className="text-xl font-semibold">Stay updated</h2>
          <div className="rounded-2xl border border-card-border bg-card p-4">
            <form onSubmit={(e)=>{ e.preventDefault(); alert('Thanks! We\'ll notify you.'); }} className="flex flex-col sm:flex-row gap-3">
              <Input type="email" placeholder="Your email" required className="flex-1"/>
              <Button type="submit">Notify me</Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">No spam. Only relevant updates about competitions, mentors, and launches.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string; }){
  return (
    <Card className="bg-card border border-card-border rounded-2xl transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">{icon} {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function SoonPill({ icon, label }: { icon: React.ReactNode; label: string; }){
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-foreground text-sm">
      {icon} <span>{label}</span>
    </div>
  );
}
