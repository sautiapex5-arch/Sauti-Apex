import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { seedTestAccounts } from "@/lib/test-accounts.functions";
import { Shield, User as UserIcon, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/test-accounts")({
  head: () => ({
    meta: [{ title: "Test Accounts — SautiApex" }, { name: "robots", content: "noindex" }],
  }),
  component: TestAccountsPage,
});

const ACCOUNTS = [
  {
    email: "admin@sautiapex.test",
    password: "AdminTest123!",
    role: "admin" as const,
    label: "Sign in as Admin",
    description: "Full access to the admin panel, all modules, and the view-switcher.",
    icon: Shield,
    redirect: "/admin",
  },
  {
    email: "client@sautiapex.test",
    password: "ClientTest123!",
    role: "client" as const,
    label: "Sign in as Client",
    description: "Client-side dashboard — projects, documents, and progress only.",
    icon: UserIcon,
    redirect: "/dashboard",
  },
];

function TestAccountsPage() {
  const seed = useServerFn(seedTestAccounts);
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("");
  const [seeded, setSeeded] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const ensureSeeded = async () => {
    if (seeded) return;
    setStatus("Seeding test accounts…");
    await seed({});
    setSeeded(true);
    setStatus("Test accounts ready.");
  };

  const signInAs = async (email: string, password: string, redirect: string) => {
    try {
      setBusy(email);
      setStatus("Preparing accounts…");
      await ensureSeeded();
      // Sign out any existing session first to ensure clean switch
      await supabase.auth.signOut();
      setStatus(`Signing in as ${email}…`);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setStatus("Signed in. Redirecting…");
      navigate({ to: redirect });
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-navy">
          DEV / QA
        </div>
        <h1 className="mt-4 text-4xl font-bold text-brand-navy">Test Account Switcher</h1>
        <p className="mt-3 text-foreground/70">
          One-click sign-in for an Admin or Client persona. Useful for testing both sides of the
          system without juggling credentials.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ACCOUNTS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.email}
              disabled={busy !== null}
              onClick={() => signInAs(a.email, a.password, a.redirect)}
              className="group rounded-xl border border-border bg-card p-6 text-left transition hover:border-brand-gold hover:shadow-lg disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-gold/15 p-2 text-brand-gold-deep">
                  <Icon size={20} />
                </div>
                <h2 className="text-lg font-semibold text-brand-navy">{a.label}</h2>
                {busy === a.email && <Loader2 size={16} className="ml-auto animate-spin" />}
              </div>
              <p className="mt-3 text-sm text-foreground/70">{a.description}</p>
              <div className="mt-4 space-y-1 rounded-md bg-secondary/60 p-3 font-mono text-xs">
                <div>
                  <span className="text-foreground/50">email:</span> {a.email}
                </div>
                <div>
                  <span className="text-foreground/50">pass:</span> {a.password}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {status && (
        <div className="mt-6 flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-3 text-sm">
          {seeded && !busy ? (
            <CheckCircle2 size={16} className="text-green-600" />
          ) : (
            <Loader2 size={16} className="animate-spin" />
          )}
          {status}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-dashed border-border p-5 text-sm text-foreground/70">
        <h3 className="mb-2 font-semibold text-brand-navy">How this works</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            First click seeds the two accounts (admin + client) in the backend with known passwords.
          </li>
          <li>The current session is signed out, then signed in as the chosen persona.</li>
          <li>
            Admins can also toggle "Admin view ↔ Client view" from the top navigation once signed
            in.
          </li>
          <li>This page is hidden from search engines and intended for internal testing only.</li>
        </ul>
      </div>
    </div>
  );
}
