import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/sectors")({
  component: Sectors,
  head: () => ({ meta: [{ title: "Sectors — SautiApex Capital Ventures Limited" }] }),
});

const sectors = [
  "Automotive industry",
  "SMEs",
  "Informal sector businesses",
  "Family businesses",
  "Community organizations",
  "Startups",
  "Civic movements",
  "Service industries",
  "Operationally unstable enterprises",
  "Youth-led enterprises",
  "Digital transformation projects",
  "Governance-linked initiatives",
  "Grassroots development programs",
];

const focus = [
  "Government tenders",
  "County government opportunities",
  "NGO & development sector",
  "Institutional supply contracts",
  "Infrastructure & implementation",
  "Service-based procurement",
  "Youth & women enterprise support",
  "SME procurement competitiveness",
];

function Sectors() {
  return (
    <SiteLayout>
      <PageHeader
        kicker="Where We Work"
        title="Built for African business environments — from grassroots to government."
        subtitle="We work across sectors where structure is scarce and where the right systems unlock disproportionate growth."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
          Target Sectors
        </div>
        <h2 className="mt-3 font-serif text-4xl text-brand-navy max-w-2xl">
          Thirteen sectors where we operate.
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map((s, i) => (
            <div
              key={s}
              className="group flex items-center gap-4 border border-border rounded-xl p-5 bg-card hover:bg-brand-navy hover:text-brand-cream transition"
            >
              <div className="font-serif text-lg text-brand-gold-deep group-hover:text-brand-gold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-medium">{s}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-cream/40 border-y border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
            Special Focus
          </div>
          <h2 className="mt-3 font-serif text-4xl text-brand-navy max-w-3xl">
            Tender, procurement & institutional opportunities.
          </h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
            {focus.map((f) => (
              <div key={f} className="bg-card p-6 hover:bg-brand-cream transition">
                <div className="h-8 w-8 rounded bg-brand-gold/20 border border-brand-gold/40" />
                <div className="mt-4 font-serif text-lg text-brand-navy">{f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
          Business Potentiality & Location Analysis Model™
        </div>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl text-brand-navy">
          Localized intelligence that maps viability before you invest.
        </h2>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          We analyze population behavior, economic activity, traffic flow, competitor positioning
          and grassroots dynamics to assess business viability within specific geographies —
          reducing operational guesswork and strengthening differentiation.
        </p>
      </section>
    </SiteLayout>
  );
}
