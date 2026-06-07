import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [{ title: "About — SautiApex Capital Ventures Limited" }] }),
});

const values = [
  "Structure",
  "Accountability",
  "Professionalism",
  "Sustainability",
  "Discipline",
  "Innovation",
  "Integrity",
  "Coordination",
];

function About() {
  return (
    <SiteLayout>
      <PageHeader
        kicker="Who We Are"
        title="A multidisciplinary consultancy built for African operational realities."
        subtitle="We exist where strategy meets the street — bridging ideas and implementation, governance and operations, communities and institutions."
      />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="prose-lg text-foreground/80 leading-relaxed space-y-6">
          <p className="text-xl text-brand-navy font-serif italic">
            Sautiapex Capital Ventures Limited is a multidisciplinary strategic consultancy,
            operational transformation, and systems development agency.
          </p>
          <p>
            We focus on stabilizing, structuring, modernizing and scaling individuals, businesses,
            organizations, projects and institutions through systems thinking, strategic
            intervention, automation, governance support, grassroots intelligence and coordinated
            professional solutions.
          </p>
          <p>
            We were founded on the understanding that most businesses, institutions and leaders do
            not fail because of lack of talent or opportunity — they fail because of poor structure,
            operational disorder, weak systems, fragmented workflows and absence of strategic
            direction.
          </p>
        </div>
      </section>

      <section className="bg-brand-cream/50 border-y border-border py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              t: "Mission",
              d: "To bridge the gap between vision and execution by building sustainable systems capable of long-term growth, accountability and institutional resilience.",
            },
            {
              icon: Eye,
              t: "Vision",
              d: "An African business ecosystem where structure outlives personalities and systems outlive emotions — where ideas reliably become reality.",
            },
            {
              icon: Heart,
              t: "Promise",
              d: "We do not solve isolated problems. We restructure the operational ecosystem surrounding the problem so it never returns.",
            },
          ].map((b) => (
            <div key={b.t} className="bg-card border border-border rounded-xl p-8">
              <div className="h-12 w-12 rounded-lg bg-brand-navy text-brand-gold flex items-center justify-center">
                <b.icon size={22} />
              </div>
              <h3 className="mt-5 font-serif text-2xl text-brand-navy">{b.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
          Core Values
        </div>
        <h2 className="mt-3 font-serif text-4xl text-brand-navy max-w-2xl">
          The principles we operate by.
        </h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <div
              key={v}
              className="border border-border rounded-xl p-6 bg-card hover:border-brand-gold transition"
            >
              <div className="font-serif text-3xl text-brand-gold">0{i + 1}</div>
              <div className="mt-3 font-serif text-xl text-brand-navy">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
