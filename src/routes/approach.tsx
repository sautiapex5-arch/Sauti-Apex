import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/approach")({
  component: Approach,
  head: () => ({ meta: [{ title: "Our Approach — SautiApex Capital Ventures Limited" }] }),
});

const phases = [
  {
    n: "01",
    t: "Diagnosis",
    d: "We assess broken ecosystems, workflow disorder, structural weaknesses, accountability failures, governance gaps and environmental instability surrounding the presenting problem.",
    out: ["Operational audit", "Ecosystem map", "Risk register", "Stakeholder review"],
  },
  {
    n: "02",
    t: "Stabilization",
    d: "We restore order, workflow discipline, communication structures, operational continuity and strategic clarity so the organization can function while we rebuild.",
    out: ["Triage plan", "Workflow restoration", "Comms cadence", "Interim governance"],
  },
  {
    n: "03",
    t: "Structuring",
    d: "We build systems, SOPs, governance frameworks, accountability mechanisms and scalable operational models that institutionalize the organization.",
    out: ["SOPs library", "Org structure", "Governance framework", "Scalability model"],
  },
  {
    n: "04",
    t: "Modernization",
    d: "We introduce digital systems, automation, reporting frameworks, operational analytics and workflow integration appropriate to the operating environment.",
    out: ["Automation rollout", "Dashboards", "Reporting structures", "Systems integration"],
  },
  {
    n: "05",
    t: "Sustainability",
    d: "We ensure continuity, resilience and long-term institutional health so structure outlives personalities and systems outlive emotions.",
    out: ["Continuity plan", "Succession framework", "Sustainability KPIs", "Long-term advisory"],
  },
];

function Approach() {
  return (
    <SiteLayout>
      <PageHeader
        kicker="The Sautiapex Method"
        title="A five-phase operational transformation framework."
        subtitle="From diagnosis to sustainability — a sequenced approach we apply to every engagement regardless of sector or scale."
      />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-gold via-brand-gold/40 to-transparent" />
          <div className="space-y-12">
            {phases.map((p) => (
              <div key={p.n} className="relative pl-24">
                <div className="absolute left-0 top-0 h-16 w-16 rounded-full bg-brand-navy text-brand-gold border-4 border-background flex items-center justify-center font-serif text-xl">
                  {p.n}
                </div>
                <div className="border border-border rounded-xl p-8 bg-card">
                  <h3 className="font-serif text-3xl text-brand-navy">{p.t}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{p.d}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.out.map((o) => (
                      <span
                        key={o}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-navy"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-gradient text-brand-cream py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold">
            Strategic Objective
          </div>
          <p className="mt-6 font-serif text-2xl md:text-3xl italic leading-relaxed">
            We do not merely help businesses solve problems. We help them become structurally
            competitive, operationally credible and institutionally sustainable.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
