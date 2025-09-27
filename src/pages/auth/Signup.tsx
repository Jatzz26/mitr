import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    role: z.enum(["student", "counsellor"], { required_error: "Please select your role" }),
    year: z.string().optional(),
    college: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .superRefine((vals, ctx) => {
    if (vals.role === "student") {
      if (!vals.year) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select your year", path: ["year"] });
      if (!vals.college || vals.college.trim().length < 2) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter your college name", path: ["college"] });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: values.name,
          year: values.year,
          college: values.college,
          role: values.role,
        },
      },
    });
    setLoading(false);
    if (error) {
      const message = error.message || "Signup failed";
      if (/already\s*registered/i.test(message)) {
        toast({ title: "Account already exists", description: "Please sign in instead.", variant: "destructive" });
        navigate("/login");
        return;
      }
      if (/signups?\s*not\s*allowed/i.test(message)) {
        toast({ title: "Signups disabled", description: "Enable new user signups in Supabase Auth settings.", variant: "destructive" });
        return;
      }
      toast({ title: "Signup failed", description: message, variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: "Please check your email to confirm." });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-card-border rounded-xl p-6 bg-card space-y-4">
        <h1 className="text-2xl font-bold">Create account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input type="text" placeholder="Full name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <select className="w-full border rounded-md px-3 py-2 bg-background" defaultValue="" {...register("role")}>
              <option value="" disabled>Your role</option>
              <option value="student">Student</option>
              <option value="counsellor">Counsellor</option>
            </select>
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <select className="w-full border rounded-md px-3 py-2 bg-background" defaultValue="" {...register("year")}>
                <option value="" disabled>Year of study</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="Other">Other</option>
              </select>
              {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
            </div>
            <div className="space-y-2">
              <Input type="text" placeholder="College name" {...register("college")} />
              {errors.college && <p className="text-sm text-destructive">{errors.college.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Input type="password" placeholder="Password" {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing up..." : "Create account"}</Button>
        </form>
        <p className="text-sm text-muted-foreground">Have an account? <Link to="/login" className="text-primary">Sign in</Link></p>
      </div>
    </div>
  );
}


