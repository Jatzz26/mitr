import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { Calendar, Clock, StickyNote, ShieldCheck, Info } from "lucide-react";
import { COUNSELLORS } from "@/lib/counsellors";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type RecProps = {
  selectedId: string;
  onSelect: (id: string) => void;
  date: string; // YYYY-MM-DD or empty
};

function weekdayFromLocalISO(iso: string) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

function RecommendedRow({ selectedId, onSelect, date }: RecProps) {
  // Rank counsellors by availability on selected date (weekday),
  // fallback to overall availability count if date not chosen.
  const weekday = weekdayFromLocalISO(date);
  const ranked = [...COUNSELLORS]
    .map(c => {
      const slots = weekday === null ? [] : (c.availability[weekday ?? 0] || []);
      const score = weekday === null
        ? Object.values(c.availability).reduce((acc, arr) => acc + arr.length, 0)
        : slots.length;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.c);

  if (ranked.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {ranked.map(c => {
        const isSel = c.id === selectedId;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(isSel ? "" : c.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              isSel ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-card-border bg-card hover:bg-muted"
            }`}
          >
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarFallback>{c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{c.name}</div>
              <div className="text-xs text-muted-foreground truncate">{c.role}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {c.specialties.slice(0,2).map(tag => (
                  <Badge key={tag} variant="secondary" className="rounded-full text-[10px]">{tag}</Badge>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function Booking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [counsellorId, setCounsellorId] = useState<string>("");

  const submit = async () => {
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }
    if (!date || !time) {
      toast({ title: "Pick date and time", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Build base payload
      const base: any = { user_id: user.id, date, time, notes };
      if (counsellorId) base.counsellor_id = counsellorId; // include only if selected

      let { error } = await supabase.from("bookings").insert(base);
      // If the column does not exist in DB, retry without it
      if (error && /counsellor_id/.test(error.message)) {
        const { error: err2 } = await supabase.from("bookings").insert({
          user_id: user.id,
          date,
          time,
          notes,
        } as any);
        error = err2 as any;
      }
      if (error) throw error;

      // Fire-and-forget: call Edge Function to send email (user must deploy this function)
      try {
        await supabase.functions.invoke("send-booking-email", {
          body: {
            email: user.email,
            date,
            time,
            counsellorId: counsellorId || null,
            notes,
          },
        });
      } catch (e) {
        // Non-blocking; log for debugging
        console.warn("Email function failed or not deployed:", e);
      }

      toast({ title: "Session booked" });
      setNotes("");
    } catch (e: any) {
      console.error("Booking failed:", e);
      toast({ title: "Could not book", description: e?.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-card border border-card-border overflow-hidden">
            <CardHeader className="bg-gradient-primary text-primary-foreground p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Book a Secure Session</CardTitle>
                  <CardDescription className="text-primary-foreground/90">
                    Select a convenient date and time. Your information remains confidential.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Recommended Counsellors */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Recommended Counsellors</h3>
                  <span className="text-xs text-muted-foreground">Optional</span>
                </div>
                <RecommendedRow selectedId={counsellorId} onSelect={setCounsellorId} date={date} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select any upcoming date for your session</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative group">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-9 rounded-xl border-input-border focus-visible:ring-2 focus-visible:ring-primary transition-[box-shadow,background,transform] duration-300"
                    />
                  </div>
                </div>
                {/* Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose a time that suits you best</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative group">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="pl-9 rounded-xl border-input-border focus-visible:ring-2 focus-visible:ring-primary transition-[box-shadow,background,transform] duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share any context to help your counsellor prepare</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative group">
                  <StickyNote className="w-4 h-4 absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Textarea
                    id="notes"
                    placeholder="Anything you'd like your counselor to know ahead of time"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="pl-9 rounded-xl min-h-[100px] border-input-border focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Ensure your email is verified in Supabase to receive confirmations.</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  onClick={submit}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-5 rounded-xl text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 focus-visible:ring-2 focus-visible:ring-purple-500 shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-[transform,box-shadow,background] duration-300"
                >
                  {loading ? "Booking..." : "Book Secure Session"}
                </Button>
                <div className="text-xs text-muted-foreground">Free cancellation up to 12 hours before session.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


