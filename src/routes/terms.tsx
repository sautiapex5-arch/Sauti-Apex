import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — SautiApex" },
      {
        name: "description",
        content: "Terms governing your use of SautiApex services and the client portal.",
      },
      { property: "og:title", content: "Terms of Service — SautiApex" },
      {
        property: "og:description",
        content: "Terms governing your use of SautiApex services and the client portal.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
});

const updated = "January 2026";

function TermsPage() {
  return (
    <SiteLayout>
      <PageHeader kicker="Legal" title="Terms of Service" subtitle={`Last updated: ${updated}`} />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Section title="1. Acceptance">
          By accessing the SautiApex website or client portal you agree to these Terms. If you do
          not agree, please do not use the service.
        </Section>
        <Section title="2. Eligibility & accounts">
          You must be 18 or older and provide accurate registration details. You're responsible for
          safeguarding your credentials and for activity under your account.
        </Section>
        <Section title="3. Engagement scope">
          Specific consulting work is governed by a signed proposal or contract. The portal is
          provided to help you administer that engagement; it does not by itself create a consulting
          relationship.
        </Section>
        <Section title="4. Acceptable use">
          You agree not to misuse the service: no unlawful, infringing, harassing or deceptive
          content; no attempts to disrupt or gain unauthorised access to the platform.
        </Section>
        <Section title="5. Fees">
          Where applicable, fees are described in your engagement letter or on our pricing page.
          Quoted amounts are exclusive of statutory taxes unless stated otherwise.
        </Section>
        <Section title="6. Intellectual property">
          You retain ownership of materials you upload. SautiApex retains ownership of its
          frameworks, templates and methodologies. Deliverables produced for you are licensed per
          your engagement contract.
        </Section>
        <Section title="7. Confidentiality">
          Each party will keep the other's confidential information secret and use it only for the
          purpose of the engagement.
        </Section>
        <Section title="8. Disclaimer & liability">
          The service is provided “as is.” To the maximum extent permitted by law, SautiApex's
          aggregate liability is limited to the fees you paid in the twelve months preceding the
          claim.
        </Section>
        <Section title="9. Termination">
          You may close your account at any time. We may suspend access for breach of these Terms or
          where required by law.
        </Section>
        <Section title="10. Governing law">
          These Terms are governed by the laws of Kenya. Disputes will be resolved in the courts of
          Nairobi, unless required otherwise by mandatory law.
        </Section>
        <Section title="11. Contact">
          Questions?{" "}
          <a href="mailto:legal@sautiapex.co.ke" className="text-brand-navy underline">
            legal@sautiapex.co.ke
          </a>
        </Section>
      </article>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-serif text-xl text-brand-navy mb-3">{title}</h2>
      <p className="text-sm text-foreground/80 leading-relaxed">{children}</p>
    </section>
  );
}
