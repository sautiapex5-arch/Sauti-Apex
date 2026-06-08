import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { toast } from "sonner";
import { loginSchema } from "@/lib/schemas";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/site/AuthLayout";
import { armSplash } from "@/components/site/SplashScreen";
import { Mail, LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign In — SautiApex Client Portal" },
      {
        name: "description",
        content:
          "Sign in to the SautiApex client portal to manage your engagements, invoices and documents securely.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    armSplash();
    toast.success("Welcome back");
    nav({ to: "/dashboard" });
  };

  const onOAuth = async (provider: "google" | "apple") => {
    armSplash();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/?auth=oauth`,
      },
    });
    if (error) {
      toast.error(error.message || `${provider} sign-in failed`);
      return;
    }
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    nav({ to: "/dashboard" });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your SautiApex client portal."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          New to SautiApex?{" "}
          <Link to="/signup" className="text-brand-navy font-semibold hover:text-brand-gold-deep">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition"
              placeholder="you@company.com"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <Link
              to="/reset-password"
              className="text-xs text-brand-navy hover:text-brand-gold-deep"
            >
              Forgot?
            </Link>
          </div>
          <div className="mt-1.5">
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground select-none cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-input accent-brand-navy"
          />
          Keep me signed in on this device
        </label>
        <button
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy text-brand-cream py-2.5 text-sm font-semibold hover:bg-brand-navy-deep transition disabled:opacity-50"
        >
          <LogIn size={15} /> {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-2.5">
        <button
          onClick={() => onOAuth("google")}
          type="button"
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-md border border-border bg-background py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition"
        >
          <GoogleIcon /> Continue with Google
        </button>
        <button
          onClick={() => onOAuth("apple")}
          type="button"
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-md bg-black text-white py-2.5 text-sm font-semibold hover:bg-black/85 transition"
        >
          <AppleIcon /> Continue with Apple
        </button>
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-center text-muted-foreground">
        By continuing you agree to our{" "}
        <Link to="/terms" className="underline hover:text-brand-navy">
          Terms
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline hover:text-brand-navy">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 7.1 29.5 5 24 5 16.3 5 9.6 9.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.2C29.5 35 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.3 35.3 44 30.1 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.13 2.97-.76.82-1.99 1.46-3 1.38-.12-1.1.43-2.24 1.12-2.97.78-.84 2.1-1.46 3-1.38zM20.5 17.27c-.55 1.27-.82 1.84-1.53 2.97-.99 1.57-2.39 3.53-4.13 3.54-1.54.02-1.94-1.01-4.04-1-2.1.01-2.54 1.02-4.08 1-1.74-.02-3.06-1.79-4.05-3.36C-.07 16.95-.36 11.7 1.55 8.91c1.36-1.98 3.5-3.14 5.52-3.14 2.05 0 3.34 1.13 5.03 1.13 1.64 0 2.64-1.13 5.01-1.13 1.8 0 3.7.98 5.06 2.67-4.44 2.43-3.72 8.78-1.67 8.83z" />
    </svg>
  );
}
