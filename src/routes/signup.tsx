import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { signupSchema } from "@/lib/schemas";
import { registerSignupClient } from "@/lib/onboarding.functions";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/site/AuthLayout";
import { armSplash } from "@/components/site/SplashScreen";
import { Mail, User, UserPlus, Check, X } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create Account — SautiApex Client Portal" },
      {
        name: "description",
        content:
          "Create a SautiApex client portal account to start your transformation engagement.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
});

function SignupPage() {
  const nav = useNavigate();
  const registerClient = useServerFn(registerSignupClient);
  const [form, setForm] = useState({ email: "", password: "", display_name: "" });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = passwordRules(form.password);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error("Please accept the Terms and Privacy Policy.");
      return;
    }
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { display_name: form.display_name },
      },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    try {
      await registerClient({ data: { email: form.email, display_name: form.display_name } });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    toast.success("Account created. Sign in, then complete the client appraisal intake.");
    nav({ to: "/login" });
  };

  return (
    <AuthLayout
      title="Create your portal account"
      subtitle="It takes less than a minute. We'll never share your information."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-navy font-semibold hover:text-brand-gold-deep">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <IconField
          id="name"
          label="Full name"
          icon={<User size={15} />}
          value={form.display_name}
          onChange={(v) => setForm({ ...form, display_name: v })}
          autoComplete="name"
          placeholder="Jane Doe"
        />
        <IconField
          id="email"
          label="Work email"
          type="email"
          icon={<Mail size={15} />}
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          autoComplete="email"
          placeholder="you@company.com"
        />
        <div>
          <label
            htmlFor="password"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Password
          </label>
          <div className="mt-1.5">
            <PasswordInput
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {form.password && (
            <ul className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px]">
              <Rule ok={rules.length}>At least 8 characters</Rule>
              <Rule ok={rules.upper}>One uppercase letter</Rule>
              <Rule ok={rules.number}>One number</Rule>
              <Rule ok={rules.symbol}>One symbol</Rule>
            </ul>
          )}
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-input accent-brand-navy"
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="underline hover:text-brand-navy">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-brand-navy">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <button
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy text-brand-cream py-2.5 text-sm font-semibold hover:bg-brand-navy-deep transition disabled:opacity-50"
        >
          <UserPlus size={15} /> {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}

function passwordRules(p: string) {
  return {
    length: p.length >= 8,
    upper: /[A-Z]/.test(p),
    number: /\d/.test(p),
    symbol: /[^A-Za-z0-9]/.test(p),
  };
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-1.5 ${ok ? "text-brand-navy" : "text-muted-foreground"}`}>
      {ok ? <Check size={12} className="text-brand-gold-deep" /> : <X size={12} />}
      {children}
    </li>
  );
}

function IconField({
  id,
  label,
  icon,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition"
        />
      </div>
    </div>
  );
}
