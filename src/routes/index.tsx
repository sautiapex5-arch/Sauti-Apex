import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  ArrowRight,
  Building2,
  TrendingUp,
  FileText,
  Cpu,
  Compass,
  Network,
  CheckCircle2,
  Quote,
} from "lucide-react";
import logo from "@/assets/sautiapex-logo.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SautiApex Capital Ventures Limited — Transforming Chaos Into Structure" },
      {
        name: "description",
        content:
          "Multidisciplinary strategic consultancy, operational transformation and systems development agency stabilizing, structuring and scaling businesses across Africa.",
      },
    ],
  }),
});

const divisions = [
  {
    icon: Building2,
    title: "Strategic Consultancy",
    desc: "Operational restructuring, governance, workflow optimization and long-term sustainability models.",
  },
  {
    icon: TrendingUp,
    title: "Capital Structuring",
    desc: "Investment readiness, business packaging, resource mobilization and expansion strategy.",
  },
  {
    icon: FileText,
    title: "Tendering & Procurement",
    desc: "Tender readiness, compliance coordination, capability statements and contract execution systems.",
  },
  {
    icon: Cpu,
    title: "Systems & Automation",
    desc: "Digital transformation, workflow automation, dashboards and management systems.",
  },
  {
    icon: Compass,
    title: "Leadership Coaching",
    desc: "Strategic guidance, crisis navigation and operational discipline coaching for leaders and teams.",
  },
  {
    icon: Network,
    title: "Grassroots Intelligence",
    desc: "Community networks, ecosystem mapping and localized business intelligence.",
  },
];

const phases = [
  {
    n: "01",
    t: "Diagnosis",
    d: "Assess broken ecosystems, fragmented workflows and governance gaps.",
  },
  {
    n: "02",
    t: "Stabilization",
    d: "Restore order, workflow discipline and operational continuity.",
  },
  {
    n: "03",
    t: "Structuring",
    d: "Build systems, SOPs, governance and scalable operational models.",
  },
  {
    n: "04",
    t: "Modernization",
    d: "Introduce digital systems, automation and operational analytics.",
  },
  {
    n: "05",
    t: "Sustainability",
    d: "Ensure continuity, resilience and long-term institutional health.",
  },
];

function Index() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-radial-glow text-brand-cream">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--brand-gold) 1px, transparent 1px), linear-gradient(90deg, var(--brand-gold) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 md:pt-32 md:pb-40 grid lg:grid-cols-[1.3fr_1fr] gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase text-brand-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" /> Strategic
              Consultancy · Est. Kenya
            </div>
            <h1 className="mt-6 font-serif text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight">
              Transforming <span className="text-gold-gradient italic">chaos</span>
              <br />
              into structure.
            </h1>
            <p className="mt-7 text-lg md:text-xl text-brand-cream/70 max-w-xl leading-relaxed">
              Sautiapex Capital Ventures Limited stabilizes, structures and scales businesses,
              institutions and operational ecosystems through systems thinking and strategic
              intervention.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-md bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-deep transition"
              >
                Explore Services{" "}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/approach"
                className="inline-flex items-center gap-2 rounded-md border border-brand-cream/20 px-7 py-3.5 text-sm font-semibold text-brand-cream hover:bg-brand-cream/5 transition"
              >
                Our 5-Phase Approach
              </Link>
            </div>
            <div className="mt-14 grid grid-cols-3 gap-8 max-w-lg border-t border-brand-cream/10 pt-8">
              {[
                { k: "6", v: "Core Divisions" },
                { k: "5", v: "Transformation Phases" },
                { k: "13+", v: "Target Sectors" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-serif text-3xl text-brand-gold">{s.k}</div>
                  <div className="text-xs mt-1 uppercase tracking-wider text-brand-cream/55">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-8 bg-brand-gold/10 rounded-full blur-3xl" />
            <div className="relative aspect-square rounded-2xl border border-brand-gold/20 bg-brand-navy-deep/60 backdrop-blur p-10 flex items-center justify-center">
              <img src={logo} alt="SautiApex" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="border-y border-border bg-brand-cream/40">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <Quote className="mx-auto text-brand-gold" size={36} />
          <p className="mt-6 font-serif text-3xl md:text-4xl text-brand-navy leading-[1.25] italic">
            "Systems outlive emotions. Structure outlives excitement. Governance outlives
            personalities."
          </p>
          <div className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Core Philosophy
          </div>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
              Core Divisions
            </div>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-brand-navy max-w-2xl">
              Six disciplines, one operating philosophy.
            </h2>
          </div>
          <Link
            to="/services"
            className="text-sm font-semibold text-brand-navy hover:text-brand-gold-deep inline-flex items-center gap-2"
          >
            View all services <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
          {divisions.map((d) => (
            <div key={d.title} className="bg-card p-8 group hover:bg-brand-cream/50 transition">
              <div className="h-12 w-12 rounded-lg bg-brand-navy text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-navy transition">
                <d.icon size={22} />
              </div>
              <h3 className="mt-6 font-serif text-xl text-brand-navy">{d.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPROACH */}
      <section className="bg-navy-gradient text-brand-cream py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold">
              The Sautiapex Method
            </div>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              From chaos to continuity in five phases.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-5 gap-px bg-brand-cream/10 rounded-xl overflow-hidden">
            {phases.map((p) => (
              <div key={p.n} className="bg-brand-navy-deep p-7">
                <div className="font-serif text-3xl text-brand-gold">{p.n}</div>
                <div className="mt-3 font-serif text-lg text-brand-cream">{p.t}</div>
                <div className="mt-2 text-sm text-brand-cream/65 leading-relaxed">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
            Why Sautiapex
          </div>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-brand-navy">
            Bridging the gap between vision and execution.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Most businesses do not fail for lack of talent or opportunity. They fail from poor
            structure, weak systems and fragmented governance. We restructure the ecosystem around
            the problem — not just the problem itself.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Implementation-oriented, not theoretical",
              "Grassroots intelligence meets institutional rigor",
              "Built for African business environments",
              "Operational discipline over operational excitement",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <CheckCircle2 size={18} className="text-brand-gold-deep mt-0.5 shrink-0" />
                <span className="text-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Vision", "Execution"],
            ["Ideas", "Systems"],
            ["Movement", "Structure"],
            ["Survival", "Sustainability"],
          ].map(([a, b]) => (
            <div
              key={a}
              className="border border-border rounded-xl p-6 bg-card hover:border-brand-gold/50 transition"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">From</div>
              <div className="font-serif text-2xl text-muted-foreground line-through decoration-1">
                {a}
              </div>
              <div className="mt-3 text-xs uppercase tracking-wider text-brand-gold-deep">To</div>
              <div className="font-serif text-2xl text-brand-navy">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-navy-gradient text-brand-cream p-12 md:p-16">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-brand-gold/20 blur-3xl" />
          <div className="relative grid md:grid-cols-[1.5fr_1fr] gap-10 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">Ready to structure your growth?</h2>
              <p className="mt-4 text-brand-cream/70 max-w-lg">
                Book a diagnostic and discover where chaos is costing you continuity.
              </p>
            </div>
            <div className="md:text-right">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold-deep transition"
              >
                Start a Conversation <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
