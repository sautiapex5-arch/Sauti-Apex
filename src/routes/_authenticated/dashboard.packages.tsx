import { createFileRoute, Link } from "@tanstack/react-router";
import { PACKAGES, RETAINERS } from "@/lib/pricing-data";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/packages")({
  component: ClientPackagesPage,
});

function ClientPackagesPage() {
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground max-w-3xl">
        Our standard engagement packages. Want a tailored scope?{" "}
        <Link to="/contact" className="text-brand-navy font-semibold hover:text-brand-gold-deep">
          Talk to your consultant
        </Link>
        .
      </p>

      {PACKAGES.map((p) => (
        <div key={p.code} className="rounded-2xl border border-border bg-card p-6">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
            {p.code}
          </div>
          <h2 className="mt-1 font-serif text-2xl text-brand-navy">{p.name}</h2>
          <p className="text-sm italic text-muted-foreground">"{p.tagline}"</p>

          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            {p.tiers.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-brand-gold/30 bg-brand-cream/40 p-4"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
                  {t.name}
                </div>
                <div className="mt-2 font-serif text-lg text-brand-navy">{t.price}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-5">
            {p.includes.map((g) => (
              <div key={g.group}>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
                  {g.group}
                </div>
                <ul className="space-y-1">
                  {g.items.map((it) => (
                    <li key={it} className="text-sm text-foreground/85 flex items-start gap-2">
                      <Check size={13} className="mt-1 text-brand-gold-deep shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl bg-navy-gradient text-brand-cream p-6">
        <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold">
          Monthly retainers
        </div>
        <div className="mt-3 grid sm:grid-cols-3 gap-3">
          {RETAINERS.map((r) => (
            <div key={r.name} className="rounded-xl border border-brand-gold/30 bg-white/5 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                {r.name}
              </div>
              <div className="mt-2 font-serif text-base">{r.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
