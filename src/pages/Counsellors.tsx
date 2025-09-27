  import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { CalendarDays, Filter } from "lucide-react";

// Types
type Counsellor = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  specialties: string[];
  languages: string[];
  // Availability by weekday: 0=Sun ... 6=Sat, times in 24h "HH:MM"
  availability: Record<number, string[]>;
};

// Mock counsellors data (7 profiles)
const COUNSELLORS: Counsellor[] = [
  {
    id: "c1",
    name: "Asha Verma",
    role: "Student Mentor",
    specialties: ["Anxiety", "Exam Stress", "Time Management"],
    languages: ["English", "Hindi"],
    availability: {
      1: ["10:00", "10:30", "11:00", "15:00", "15:30"],
      2: ["09:00", "09:30", "14:00", "14:30", "16:00"],
      4: ["10:00", "10:30", "11:00", "11:30"],
    },
  },
  {
    id: "c2",
    name: "Rahul Mehta",
    role: "Faculty Counsellor",
    specialties: ["Burnout", "Career", "Motivation"],
    languages: ["English"],
    availability: {
      1: ["13:00", "13:30", "14:00"],
      3: ["10:00", "10:30", "11:00", "17:00"],
      5: ["09:00", "09:30", "10:00"],
    },
  },
  {
    id: "c3",
    name: "Neha Gupta",
    role: "Student Mentor",
    specialties: ["Self-esteem", "Relationships"],
    languages: ["English", "Hindi"],
    availability: {
      2: ["11:00", "11:30", "12:00", "16:30"],
      4: ["09:00", "09:30", "10:00"],
    },
  },
  {
    id: "c4",
    name: "Vikram Singh",
    role: "Faculty Counsellor",
    specialties: ["Depression", "Stress", "Habits"],
    languages: ["Hindi"],
    availability: {
      1: ["09:00", "09:30", "10:00"],
      2: ["15:00", "15:30", "16:00"],
      4: ["11:00", "11:30"],
    },
  },
  {
    id: "c5",
    name: "Sara Khan",
    role: "Student Mentor",
    specialties: ["Exam Stress", "Procrastination"],
    languages: ["English", "Urdu"],
    availability: {
      2: ["10:00", "10:30", "11:00", "14:00"],
      3: ["09:00", "09:30"],
      5: ["15:00", "15:30"],
    },
  },
  {
    id: "c6",
    name: "Anil Kumar",
    role: "Faculty Counsellor",
    specialties: ["Career", "Decision Making"],
    languages: ["English", "Hindi"],
    availability: {
      1: ["16:00", "16:30", "17:00"],
      3: ["13:00", "13:30", "14:00"],
    },
  },
  {
    id: "c7",
    name: "Priya Das",
    role: "Student Mentor",
    specialties: ["Anxiety", "Sleep"],
    languages: ["English", "Bengali"],
    availability: {
      0: ["10:00", "10:30"], // Sunday
      6: ["11:00", "11:30", "12:00"], // Saturday
    },
  },
];

const ALL_SPECIALTIES = Array.from(new Set(COUNSELLORS.flatMap(c => c.specialties))).sort();
const ALL_LANGUAGES = Array.from(new Set(COUNSELLORS.flatMap(c => c.languages))).sort();

// Helpers
function getCurrentWeek(): Date[] {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const mondayOffset = (day === 0 ? -6 : 1 - day); // move to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0,0,0,0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDateISO(d: Date) {
  // Build local ISO date (YYYY-MM-DD) without timezone shifting
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function weekdayFromLocalISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

export default function Counsellors() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [specialty, setSpecialty] = useState<string>("all");
  const [language, setLanguage] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("any");

  const [open, setOpen] = useState(false);
  const [activeCounsellor, setActiveCounsellor] = useState<Counsellor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const week = useMemo(() => getCurrentWeek(), []);

  const filtered = useMemo(() => {
    const now = new Date();
    const weekday = now.getDay();
    const minutesNow = now.getHours() * 60 + now.getMinutes();

    function hasWeekdaySlots(c: Counsellor) {
      return [1,2,3,4,5].some((d) => (c.availability[d] || []).length > 0);
    }
    function hasWeekendSlots(c: Counsellor) {
      return [0,6].some((d) => (c.availability[d] || []).length > 0);
    }
    function hasNowSlot(c: Counsellor) {
      const slots = c.availability[weekday] || [];
      return slots.some((t) => {
        const [hh, mm] = t.split(":").map(Number);
        const mins = hh * 60 + mm;
        return mins >= minutesNow;
      });
    }

    return COUNSELLORS.filter(c => {
      const bySpec = specialty === "all" || c.specialties.includes(specialty);
      const byLang = language === "all" || c.languages.includes(language);
      let byAvail = true;
      if (availabilityFilter === "weekdays") byAvail = hasWeekdaySlots(c);
      if (availabilityFilter === "weekends") byAvail = hasWeekendSlots(c);
      if (availabilityFilter === "now") byAvail = hasNowSlot(c);
      return bySpec && byLang && byAvail;
    });
  }, [specialty, language, availabilityFilter]);

  const openBooking = (c: Counsellor) => {
    setActiveCounsellor(c);
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    setOpen(true);
  };

  const confirmBooking = async () => {
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }
    if (!activeCounsellor || !selectedDate || !selectedTime) {
      toast({ title: "Select a date and time", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      counsellor_id: activeCounsellor.id,
      date: selectedDate,
      time: selectedTime,
      notes,
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not book", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Session booked" });
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Find a Counsellor</h1>
          <div className="hidden sm:flex items-center text-muted-foreground"><Filter className="w-4 h-4 mr-2"/>Smart filters</div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Book a confidential session with trusted mentors and faculty counsellors.</p>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent className="bg-card text-foreground border border-card-border shadow-card">
              <SelectItem value="all">All specialties</SelectItem>
              {ALL_SPECIALTIES.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-card text-foreground border border-card-border shadow-card">
              <SelectItem value="all">All languages</SelectItem>
              {ALL_LANGUAGES.map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent className="bg-card text-foreground border border-card-border shadow-card">
              <SelectItem value="any">Any availability</SelectItem>
              <SelectItem value="weekdays">Weekdays</SelectItem>
              <SelectItem value="weekends">Weekends</SelectItem>
              <SelectItem value="now">Now</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <Card key={c.id} className="group rounded-2xl shadow-card border border-card-border overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-glow">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  {/* Avatar image could be used here; we use initials fallback */}
                  <AvatarFallback>{c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">{c.role}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {c.specialties.map(tag => (
                    <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Languages: {c.languages.join(", ")}</div>
                <Button onClick={() => openBooking(c)} className="w-full rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 focus-visible:ring-2 focus-visible:ring-purple-500 shadow-soft hover:shadow-glow transition-all flex items-center justify-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Book a Secure Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book a Secure Session</DialogTitle>
            <p className="text-sm text-muted-foreground">Your information is confidential. Booking with {activeCounsellor?.name}.</p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={selectedTime} onChange={(e)=>setSelectedTime(e.target.value)} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" placeholder="Anything you'd like your counselor to know ahead of time" value={notes} onChange={(e)=>setNotes(e.target.value)} className="rounded-xl min-h-[90px]" />
              <p className="text-xs text-muted-foreground">Ensure your email is verified in Supabase to receive confirmations.</p>
            </div>
            <div className="text-xs text-muted-foreground">Free cancellation up to 12 hours before session.</div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={confirmBooking} disabled={submitting || !selectedDate || !selectedTime} className="rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 focus-visible:ring-2 focus-visible:ring-purple-500">
              {submitting ? "Booking..." : "Book Secure Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
