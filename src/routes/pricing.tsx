import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { PACKAGES, RETAINERS, PHASES } from "@/lib/pricing-data";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";

type IsolatedService = {
  id: string;
  category: string;
  name: string;
  description?: string | null;
  price_range?: string | null;
};

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing & Packages — SautiApex Capital Ventures Limited" },
      {
        name: "description",
        content:
          "Transparent consultancy packages and engagement structure for startups, SMEs and growth-stage enterprises.",
      },
    ],
  }),
});

function PricingPage() {
  const { data: services = [] } = useQuery({
    queryKey: ["pricing-isolated-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("isolated_services")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      <PageHeader
        kicker="Pricing & Engagement"
        title="Clear packages. Structured engagement. Transformative outcomes."
        subtitle="Three flagship packages, retainer models and a phased engagement process — built to take businesses from instability to sustainable structure."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 space-y-16">
        {PACKAGES.map((p) => (
          <article key={p.code} className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <div className="grid md:grid-cols-[280px_1fr] gap-8">
              <div>
                <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
                  {p.code}
                </div>
                <h2 className="mt-3 font-serif text-2xl text-brand-navy leading-tight">{p.name}</h2>
                <p className="mt-2 text-sm italic text-muted-foreground">"{p.tagline}"</p>
                <div className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Designed for
                </div>
                <ul className="space-y-1.5">
                  {p.designedFor.map((d) => (
                    <li key={d} className="text-sm text-foreground/85 flex items-start gap-2">
                      <span className="mt-2 h-1 w-3 bg-brand-gold shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {p.includes.map((g) => (
                    <div key={g.group}>
                      <div className="text-xs font-semibold uppercase tracking-wider text-brand-navy mb-2">
                        {g.group}
                      </div>
                      <ul className="space-y-1.5">
                        {g.items.map((it) => (
                          <li
                            key={it}
                            className="text-sm text-foreground/85 flex items-start gap-2"
                          >
                            <Check size={14} className="mt-1 text-brand-gold-deep shrink-0" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              {p.tiers.map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-brand-gold/30 bg-brand-cream/40 p-5"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
                    {t.name}
                  </div>
                  <div className="mt-2 font-serif text-xl text-brand-navy">{t.price}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">Pricing depends on:</span>{" "}
              {p.pricingNotes.join(" · ")}
            </div>
          </article>
        ))}

        <article className="rounded-2xl bg-navy-gradient text-brand-cream p-8 md:p-10">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold">
            Retainer & long-term consultancy
          </div>
          <h2 className="mt-3 font-serif text-2xl">Monthly retainers</h2>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {RETAINERS.map((r) => (
              <div key={r.name} className="rounded-xl border border-brand-gold/30 bg-white/5 p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  {r.name}
                </div>
                <div className="mt-2 font-serif text-lg">{r.price}</div>
              </div>
            ))}
          </div>
        </article>

        {services.length > 0 && (
          <article>
            <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
              Isolated services
            </div>
            <h2 className="mt-2 font-serif text-3xl text-brand-navy">Standalone services</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {(services as IsolatedService[]).map((s) => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
                    {s.category}
                  </div>
                  <h3 className="mt-2 font-serif text-lg text-brand-navy">{s.name}</h3>
                  {s.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  )}
                  {s.price_range && (
                    <div className="mt-4 text-sm font-semibold text-brand-navy">
                      {s.price_range}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>
        )}

        <article>
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
            Engagement model
          </div>
          <h2 className="mt-2 font-serif text-3xl text-brand-navy">Our four-phase engagement</h2>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PHASES.map((ph) => (
              <div key={ph.code} className="rounded-xl border border-border bg-card p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
                  {ph.code}
                </div>
                <div className="mt-1 font-serif text-lg text-brand-navy">{ph.name}</div>
                <ul className="mt-3 space-y-1.5">
                  {ph.items.map((i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="mt-2 h-1 w-3 bg-brand-gold shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <div className="rounded-2xl border border-brand-gold/40 bg-brand-cream/40 p-8 text-center">
          <h3 className="font-serif text-2xl text-brand-navy">Ready to scope your engagement?</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Complete the intake questionnaire and we'll respond with a tailored proposal and pricing
            within 48 hours.
          </p>
          <div className="mt-5 flex gap-3 justify-center">
            <Link
              to="/intake"
              className="rounded-md bg-brand-navy text-brand-cream px-5 py-2.5 text-sm font-semibold"
            >
              Start Intake
            </Link>
            <Link
              to="/contact"
              className="rounded-md border border-brand-navy text-brand-navy px-5 py-2.5 text-sm font-semibold"
            >
              Talk to us
            </Link>
          </div>
          <p className="mt-6 text-[11px] text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            SautiApex operates as a strategic consultancy and systems-transformation platform.
            Regulated services (legal, audit, tax, engineering, specialized compliance) are
            coordinated through licensed professionals where applicable.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
