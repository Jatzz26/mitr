import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Moon, Watch, Droplet, Dumbbell, Brain, Shield, PlugZap, Signal, Star, Store } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Quick mock of connected device
type Device = {
  id: string;
  name: string;
  brand: string;
  type: "fitness" | "sleep" | "nutrition" | "mindfulness" | "medical";
  status: "connected" | "disconnected";
  lastSync?: string;
};

const supported: Device[] = [
  { id: "fitbit", name: "Fitbit", brand: "Fitbit", type: "fitness", status: "disconnected" },
  { id: "google-fit", name: "Google Fit", brand: "Google", type: "fitness", status: "disconnected" },
  { id: "samsung-health", name: "Samsung Health", brand: "Samsung", type: "fitness", status: "disconnected" },
  { id: "healthifyme-band", name: "HealthifyMe Band", brand: "HealthifyMe", type: "fitness", status: "disconnected" },
  { id: "oura", name: "Oura Ring", brand: "Oura", type: "sleep", status: "disconnected" },
  { id: "withings-bpm", name: "Withings BPM", brand: "Withings", type: "medical", status: "disconnected" },
  { id: "accu-chek", name: "Accu-Chek Glucometer", brand: "Roche", type: "medical", status: "disconnected" },
];

const demoDaily = {
  steps: [7200, 10340, 8300, 12500, 5600, 9100, 9800],
  heart: [72, 74, 70, 76, 73, 75, 71],
  sleep: [6.8, 7.2, 6.5, 8.0, 7.0, 7.5, 6.9],
  hydration: [1.5, 1.8, 2.0, 1.6, 1.4, 2.2, 1.9],
  stress: [3, 2, 4, 3, 5, 2, 3],
};

export default function DevicesHub() {
  const [devices, setDevices] = useState<Device[]>(supported);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [wizardFor, setWizardFor] = useState<Device | null>(null);
  const [demo, setDemo] = useState(demoDaily);

  function toggleConnect(id: string) {
    const dev = devices.find(d=>d.id===id) || null;
    if (dev && dev.status === "disconnected") {
      setWizardFor(dev);
      return;
    }
    setConnecting(id);
    setTimeout(() => {
      setDevices((list) =>
        list.map((d) =>
          d.id === id
            ? { ...d, status: d.status === "connected" ? "disconnected" : "connected", lastSync: new Date().toISOString() }
            : d
        )
      );
      setConnecting(null);
    }, 800);
  }

  const connected = useMemo(() => devices.filter((d) => d.status === "connected"), [devices]);
  function syncNow() {
    // Randomize demo values a bit to simulate sync
    const jitter = (n: number, p=0.1) => Math.max(0, Math.round(n * (1 + (Math.random()-0.5)*2*p)));
    setDemo((d) => ({
      steps: [...d.steps.slice(1), jitter(d.steps[d.steps.length-1] + (Math.random()*2000-1000), 0.2)],
      heart: [...d.heart.slice(1), jitter(d.heart[d.heart.length-1] + (Math.random()*2-1), 0.05)],
      sleep: [...d.sleep.slice(1), Math.max(5.5, Math.min(9, +(d.sleep[d.sleep.length-1] + (Math.random()*1-0.5)).toFixed(1)))],
      hydration: [...d.hydration.slice(1), Math.max(1, Math.min(3, +(d.hydration[d.hydration.length-1] + (Math.random()*0.6-0.3)).toFixed(1)))],
      stress: [...d.stress.slice(1), Math.max(1, Math.min(5, Math.round(d.stress[d.stress.length-1] + (Math.random()*2-1))))],
    }));
  }

  return (
    <>
    <Tabs defaultValue="connect" className="w-full">
      <TabsList className="mb-4 flex flex-wrap gap-2">
        <TabsTrigger value="connect">Connect</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="market">Marketplace</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
      </TabsList>

      {/* Connect tab */}
      <TabsContent value="connect" className="space-y-4">
        <Card className="bg-card border border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Device Integration Hub</CardTitle>
              <Button variant="outline" size="sm" onClick={syncNow}>Sync Now</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your fitness bands, watches, sleep trackers, glucometers, and more. We’ll sync steps, heart rate, sleep, hydration, nutrition, workouts and mindfulness data into a single dashboard.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((d) => (
                <Card key={d.id} className="bg-muted/30 border border-card-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Watch className="w-4 h-4" /> {d.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="text-muted-foreground">Brand: {d.brand}</div>
                    <div className="flex items-center gap-2">
                      <Signal className={d.status === "connected" ? "text-green-600 w-4 h-4" : "text-muted-foreground w-4 h-4"} />
                      <span>{d.status === "connected" ? "Connected" : "Disconnected"}</span>
                    </div>
                    {d.lastSync && <div className="text-xs text-muted-foreground">Last sync: {new Date(d.lastSync).toLocaleString()}</div>}
                    <Button size="sm" className="mt-2" onClick={() => toggleConnect(d.id)} disabled={connecting === d.id}>
                      {d.status === "connected" ? "Disconnect" : connecting === d.id ? "Connecting…" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {connected.length > 0 && (
          <Card className="bg-card border border-card-border">
            <CardHeader>
              <CardTitle className="text-base">Connected devices</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {connected.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-2"><Watch className="w-4 h-4" /> {c.name}</div>
                  <div>Last sync: {new Date(c.lastSync || Date.now()).toLocaleString()}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Analytics tab */}
      <TabsContent value="analytics" className="space-y-4">
        <Card className="bg-card border border-card-border">
          <CardHeader>
            <CardTitle className="text-base">Unified Health Analytics</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard icon={<Activity className="w-4 h-4" />} title="Steps" subtitle="Daily" value={`${demo.steps[demo.steps.length-1].toLocaleString()} steps`} trend="+12%" series={demo.steps} />
            <MetricCard icon={<Heart className="w-4 h-4" />} title="Heart Rate" subtitle="Resting" value={`${demo.heart[demo.heart.length-1]} bpm`} trend="stable" series={demo.heart} />
            <MetricCard icon={<Moon className="w-4 h-4" />} title="Sleep" subtitle="Last night" value={`${demo.sleep[demo.sleep.length-1]} h`} trend="-5%" series={demo.sleep} />
            <MetricCard icon={<Droplet className="w-4 h-4" />} title="Hydration" subtitle="Today" value={`${demo.hydration[demo.hydration.length-1]} L`} trend="+8%" series={demo.hydration} />
            <MetricCard icon={<Brain className="w-4 h-4" />} title="Mindfulness" subtitle="Stress" value={`Level ${demo.stress[demo.stress.length-1]}`} trend="improving" series={demo.stress} />
            <MetricCard icon={<Dumbbell className="w-4 h-4" />} title="Workouts" subtitle="This week" value={`4 sessions`} trend="+1" />
          </CardContent>
        </Card>

        <Card className="bg-card border border-card-border">
          <CardHeader>
            <CardTitle className="text-base">Trends (demo)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Replace with Recharts later */}
            <div className="text-xs overflow-auto rounded border p-2 bg-muted/30">
              <pre>{JSON.stringify(demo, null, 2)}</pre>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Suggestions: Set a sleep goal of 7.5h, hydrate +0.5L, try a 10-min meditation session.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Marketplace tab */}
      <TabsContent value="market" className="space-y-4">
        <Card className="bg-card border border-card-border">
          <CardHeader>
            <CardTitle className="text-base">Device Marketplace</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MarketCard title="Fitbit Charge 6" rating={4.6} usecase="Steps, HR, workouts" href="https://www.fitbit.com/" />
            <MarketCard title="Oura Ring" rating={4.5} usecase="Sleep, readiness" href="https://ouraring.com" />
            <MarketCard title="Withings BPM" rating={4.3} usecase="Blood pressure" href="https://www.withings.com/" />
            <MarketCard title="Accu-Chek" rating={4.1} usecase="Glucose monitoring" href="https://www.accu-chek.in/" />
            <MarketCard title="HealthifyMe Band" rating={4.0} usecase="Fitness, nutrition" href="https://www.healthifyme.com" />
          </CardContent>
        </Card>
      </TabsContent>

      {/* FAQ tab */}
      <TabsContent value="faq" className="space-y-4">
        <Card className="bg-card border border-card-border">
          <CardHeader>
            <CardTitle className="text-base">FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <div className="font-medium text-foreground">How does syncing work?</div>
              We connect via each provider’s APIs (e.g., Fitbit, Google Fit). You control consent and can revoke anytime.
            </div>
            <div>
              <div className="font-medium text-foreground">What data do you store?</div>
              Only the metrics needed for analytics and recommendations. You can delete data anytime.
            </div>
            <div>
              <div className="font-medium text-foreground">Is this ABDM-ready?</div>
              Yes, we follow consent-first design and plan interoperability with ABDM for India where applicable.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Privacy tab */}
      <TabsContent value="privacy" className="space-y-4">
        <Card className="bg-card border border-card-border">
          <CardHeader>
            <CardTitle className="text-base">Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground"><Shield className="w-4 h-4"/> Consent-based data access</div>
            <div>• Clear opt-in for each device and metric.</div>
            <div>• You can disconnect devices and delete data anytime.</div>
            <div>• Data encrypted at rest and in transit.</div>
            <div>• Regional language support planned (Hindi and more).</div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* Connect Wizard */}
    <Dialog open={!!wizardFor} onOpenChange={(o)=>{ if(!o) setWizardFor(null); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Connect {wizardFor?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p>Step 1: Review consent. We will read steps, heart rate, sleep and related activity from your {wizardFor?.name} account.</p>
          <p>Step 2: You will be redirected to {wizardFor?.brand} to sign in and approve access.</p>
          <p>Step 3: After approval, we’ll start your first sync.</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={()=>setWizardFor(null)}>Cancel</Button>
            <Button onClick={()=>{
              if(!wizardFor) return; setConnecting(wizardFor.id);
              setWizardFor(null);
              setTimeout(()=>{
                setDevices(list=>list.map(d=> d.id===wizardFor.id ? { ...d, status:'connected', lastSync:new Date().toISOString() } : d));
                setConnecting(null);
              }, 800);
            }}>Approve & Connect</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

function MetricCard({ icon, title, subtitle, value, trend, series }: { icon: React.ReactNode; title: string; subtitle: string; value: string; trend: string; series?: number[]; }) {
  return (
    <Card className="bg-muted/30 border border-card-border">
      <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">{icon} {title}</CardTitle></CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
        <div className="text-xl font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{trend}</div>
        {series && <div className="mt-2"><Sparkline data={series} /></div>}
      </CardContent>
    </Card>
  );
}

function MarketCard({ title, rating, usecase, href }: { title: string; rating: number; usecase: string; href: string; }) {
  return (
    <Card className="bg-muted/30 border border-card-border">
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Store className="w-4 h-4" /> {title}</CardTitle></CardHeader>
      <CardContent className="text-sm">
        <div className="text-muted-foreground">{usecase}</div>
        <div className="flex items-center gap-1 mt-1 text-amber-500">
          <Star className="w-4 h-4"/>
          <span className="text-xs">{rating.toFixed(1)} / 5</span>
        </div>
        <a href={href} target="_blank" rel="noreferrer" className="inline-block mt-2 text-primary underline">Learn more</a>
      </CardContent>
    </Card>
  );
}

function Sparkline({ data }: { data: number[] }){
  const w = 160, h = 40, p = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const xs = data.map((_,i)=> p + (i*(w-2*p))/(data.length-1 || 1));
  const ys = data.map(v => h - p - ((v - min) / ((max - min) || 1)) * (h-2*p));
  const d = xs.map((x,i)=> `${i? 'L':'M'}${x},${ys[i]}`).join(' ');
  const lastX = xs[xs.length-1];
  const lastY = ys[ys.length-1];
  return (
    <svg width={w} height={h} className="text-primary/70">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx={lastX} cy={lastY} r={3} fill="currentColor" />
    </svg>
  );
}
