import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Building2, TrendingUp, FileText, Cpu, Compass, Network, Briefcase } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({ meta: [{ title: "Services — SautiApex Capital Ventures Limited" }] }),
});

const divisions = [
  {
    icon: Building2,
    code: "01",
    title: "Strategic Business Consultancy & Organizational Development",
    blurb:
      "Stabilizing and modernizing businesses through restructuring, workflow optimization and governance.",
    items: [
      "Business diagnostics & operational assessment",
      "Organizational restructuring",
      "Workflow & process optimization",
      "Growth & scalability strategy",
      "Business recovery & stabilization",
      "Operational discipline systems",
      "Team structure development",
      "Crisis management strategy",
      "Productivity enhancement systems",
      "Modernization frameworks",
      "Governance support",
      "Continuity planning",
    ],
  },
  {
    icon: TrendingUp,
    code: "1A",
    title: "Capital Structuring, Resource Mobilization & Investment Readiness",
    blurb:
      "Positioning businesses to access capital, financing and growth opportunities with credibility.",
    items: [
      "Business packaging & positioning",
      "Investment readiness structuring",
      "Growth & expansion planning",
      "Business profile development",
      "Proposal & pitch structuring",
      "Financial systems coordination",
      "Resource mobilization support",
      "Investor/lender preparedness",
      "Operational formalization",
      "Strategic documentation",
      "Scalability assessment",
      "Sustainability frameworks",
    ],
  },
  {
    icon: FileText,
    code: "1B",
    title: "Tendering, Procurement & Contract Readiness Support",
    blurb:
      "Making businesses structurally competitive within procurement and contractual ecosystems.",
    items: [
      "Tender readiness support",
      "Business compliance coordination",
      "Company profiling & packaging",
      "Capability statement development",
      "Proposal structuring",
      "Documentation coordination",
      "Operational structuring for contractors",
      "Supplier positioning support",
      "Contract execution systems",
      "Procurement workflow structuring",
      "Stakeholder coordination",
      "Project reporting structures",
    ],
  },
  {
    icon: Cpu,
    code: "02",
    title: "Systems Development, Automation & Digital Transformation",
    blurb:
      "Building digital infrastructure for operations that still run manually in African contexts.",
    items: [
      "Management systems development",
      "Workflow automation",
      "Garage management systems",
      "Attendance & accountability systems",
      "Digital reporting systems",
      "Customer management systems",
      "Operational dashboards",
      "Process automation",
      "Systems integration",
      "Website development & structuring",
      "Operational analytics",
      "Business intelligence systems",
    ],
  },
  {
    icon: Briefcase,
    code: "03",
    title: "Concept Development, Innovation & Systems Architecture",
    blurb:
      "Turning ideas into structured operational realities for startups, SMEs and growing enterprises.",
    items: [
      "Concept design & structuring",
      "Operating model development",
      "Institutional sustainability planning",
      "Strategic implementation frameworks",
      "Innovation roadmaps",
      "Systems architecture",
    ],
  },
  {
    icon: Compass,
    code: "04",
    title: "Leadership Support, Strategic Guidance & Operational Coaching",
    blurb:
      "Helping leaders maintain clarity and discipline during instability, growth and transition.",
    items: [
      "Strategic guidance",
      "Leadership support",
      "Conflict de-escalation support",
      "Decision-support systems",
      "Operational discipline coaching",
      "Crisis navigation support",
      "Executive accountability frameworks",
    ],
  },
  {
    icon: Network,
    code: "05",
    title: "Grassroots Intelligence & Coordinated Professional Services",
    blurb:
      "Ecosystem mapping, community networks and coordinated specialist referrals where regulated.",
    items: [
      "Compliance coordination",
      "Tax & regulatory coordination",
      "HR coordination",
      "Branding & marketing coordination",
      "Public relations support",
      "Stakeholder engagement",
      "Professional referral coordination",
      "Institutional support coordination",
    ],
  },
];

function Services() {
  return (
    <SiteLayout>
      <PageHeader
        kicker="What We Do"
        title="Seven service divisions. One coherent operating system."
        subtitle="Each division stands alone — together they restructure entire operational ecosystems from diagnosis through sustainability."
      />
      <section className="mx-auto max-w-7xl px-6 py-20 space-y-10">
        {divisions.map((d, i) => (
          <article
            key={d.code}
            className="grid md:grid-cols-[280px_1fr] gap-8 border border-border rounded-2xl p-8 md:p-10 bg-card hover:border-brand-gold/50 transition"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div>
              <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
                Division {d.code}
              </div>
              <div className="mt-4 h-14 w-14 rounded-lg bg-brand-navy text-brand-gold flex items-center justify-center">
                <d.icon size={26} />
              </div>
              <h3 className="mt-5 font-serif text-2xl text-brand-navy leading-tight">{d.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d.blurb}</p>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Services Include
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {d.items.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <span className="mt-2 h-1 w-3 bg-brand-gold shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
