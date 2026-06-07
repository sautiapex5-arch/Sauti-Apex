import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { SplashScreen } from "./SplashScreen";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <SplashScreen always />
      {/* Brand panel */}
      <aside className="relative hidden md:flex flex-col justify-between bg-navy-gradient text-brand-cream p-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative">
          <Logo variant="light" />
        </div>
        <div className="relative space-y-6 max-w-md">
          <p className="font-serif text-3xl leading-tight">
            “Systems outlive emotions. Structure outlives personalities.”
          </p>
          <p className="text-sm text-brand-cream/70">
            The SautiApex client portal — track engagements, review deliverables, and access your
            strategy room in one secure place.
          </p>
          <ul className="space-y-3 text-sm text-brand-cream/80">
            <li className="flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-brand-gold mt-0.5 shrink-0" />
              Bank-grade encryption in transit and at rest.
            </li>
            <li className="flex items-start gap-2.5">
              <Lock size={16} className="text-brand-gold mt-0.5 shrink-0" />
              Role-based access — only your team sees your data.
            </li>
            <li className="flex items-start gap-2.5">
              <Sparkles size={16} className="text-brand-gold mt-0.5 shrink-0" />
              Confidential by default. No third-party tracking inside the portal.
            </li>
          </ul>
        </div>
        <div className="relative text-xs text-brand-cream/55">
          © {new Date().getFullYear()} Sautiapex Capital Ventures Limited
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col">
        <div className="flex items-center justify-between px-6 md:px-10 py-5 md:py-6 border-b border-border/60">
          <div className="md:hidden">
            <Logo />
          </div>
          <div className="text-xs text-muted-foreground ml-auto">
            <Link to="/" className="hover:text-brand-navy">
              ← Back to site
            </Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 md:px-10 py-10">
          <div className="w-full max-w-md">
            <h1 className="font-serif text-3xl md:text-4xl text-brand-navy">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6">{footer}</div>}
          </div>
        </div>
        <div className="px-6 md:px-10 py-5 border-t border-border/60 text-[11px] text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-between">
          <span>Protected by industry-standard security.</span>
          <span className="flex gap-3">
            <Link to="/privacy" className="hover:text-brand-navy">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-brand-navy">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-brand-navy">
              Cookies
            </Link>
          </span>
        </div>
      </main>
    </div>
  );
}
