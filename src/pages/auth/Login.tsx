import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>("");
  const [roleError, setRoleError] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    if (!role) {
      setRoleError("Please select your role");
      toast({ title: "Role required", description: "Please select if you are a Student or a Counsellor.", variant: "destructive" });
      return;
    } else {
      setRoleError("");
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setLoading(false);
    if (error) {
      const message = error.message || "Login failed";
      // Common 400 causes: email not confirmed, invalid credentials
      if (/confirm/i.test(message) || /not\s*confirmed/i.test(message)) {
        toast({ title: "Confirm your email", description: "Please verify your email, then try again.", variant: "destructive" });
        return;
      }
      if (/invalid/i.test(message) || /invalid login credentials/i.test(message)) {
        toast({ title: "Invalid credentials", description: "Check your email and password.", variant: "destructive" });
        return;
      }
      if (/over\s*quota|rate|too\s*many/i.test(message)) {
        toast({ title: "Too many attempts", description: "Please wait a minute and try again.", variant: "destructive" });
        return;
      }
      toast({ title: "Login failed", description: message, variant: "destructive" });
      return;
    }
    // Determine role and route
    const { data: userRes } = await supabase.auth.getUser();
    const meta: any = userRes?.user?.user_metadata || {};
    const effectiveRole = (role || meta.role || "student") as string;
    try {
      if (role && role !== meta.role) {
        await supabase.auth.updateUser({ data: { role } });
      }
    } catch {}
    toast({ title: "Welcome back" });
    if (effectiveRole === "counsellor") navigate("/counsellors"); else navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-card-border rounded-xl p-6 bg-card space-y-4">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <select className="w-full border rounded-md px-3 py-2 bg-background" aria-required value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="">Your role</option>
              <option value="student">Student</option>
              <option value="counsellor">Counsellor</option>
            </select>
            {roleError ? (
              <p className="text-sm text-destructive">{roleError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Selecting your role helps us show the right experience.</p>
            )}
          </div>
          <div className="space-y-2">
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Input type="password" placeholder="Password" {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={async () => {
                  const email = (getValues("email") || "").trim();
                  if (!email) {
                    toast({ title: "Enter your email", description: "Please enter your email above, then click Forgot password.", variant: "default" });
                    return;
                  }
                  try {
                    await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    toast({ title: "Reset link sent", description: "Check your inbox for password reset instructions." });
                  } catch (e: any) {
                    toast({ title: "Could not send reset link", description: e?.message || "Please try again later.", variant: "destructive" });
                  }
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        </form>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            No account? <Link to="/signup" className="text-primary">Create one</Link>
          </span>
          <Link to="/reset-password" className="text-primary">Have a reset link?</Link>
        </div>
      </div>
    </div>
  );
}


