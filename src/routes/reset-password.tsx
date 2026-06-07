import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/site/AuthLayout";
import { Mail, KeyRound } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password — SautiApex" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: "/reset-password" }],
  }),
});

function ResetPasswordPage() {
  const [mode, setMode] = useState<"request" | "set">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setMode("set");
    }
  }, []);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Check your inbox for the reset link.");
  };

  const setNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Minimum 8 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Password updated. You can sign in now.");
  };

  return (
    <AuthLayout
      title={mode === "request" ? "Reset your password" : "Set a new password"}
      subtitle={
        mode === "request"
          ? "Enter your account email and we'll send a secure reset link."
          : "Choose a strong password you don't use anywhere else."
      }
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link to="/login" className="text-brand-navy font-semibold hover:text-brand-gold-deep">
            Back to sign in
          </Link>
        </p>
      }
    >
      {mode === "request" ? (
        <form onSubmit={requestReset} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Email address
            </label>
            <div className="relative mt-1.5">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>
          </div>
          <button
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy text-brand-cream py-2.5 text-sm font-semibold hover:bg-brand-navy-deep transition disabled:opacity-50"
          >
            <KeyRound size={15} /> {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      ) : (
        <form onSubmit={setNewPassword} className="space-y-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              New password
            </label>
            <div className="mt-1.5">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
              />
            </div>
          </div>
          <button
            disabled={loading}
            className="w-full rounded-md bg-brand-navy text-brand-cream py-2.5 text-sm font-semibold hover:bg-brand-navy-deep transition disabled:opacity-50"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
