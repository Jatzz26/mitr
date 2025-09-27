import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password || password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      navigate("/login");
    } catch (e: any) {
      toast({ title: "Could not reset password", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-card-border rounded-xl p-6 bg-card space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-muted-foreground">Enter a new password for your account.</p>
        <div className="space-y-2">
          <Input type="password" placeholder="New password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Input type="password" placeholder="Confirm new password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
        </div>
        <Button className="w-full" onClick={submit} disabled={loading}>{loading ? "Updating..." : "Update password"}</Button>
      </div>
    </div>
  );
}
