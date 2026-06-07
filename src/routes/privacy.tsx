import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — SautiApex" },
      {
        name: "description",
        content:
          "How SautiApex Capital Ventures collects, uses, and protects your personal information.",
      },
      { property: "og:title", content: "Privacy Policy — SautiApex" },
      {
        property: "og:description",
        content:
          "How SautiApex Capital Ventures collects, uses, and protects your personal information.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
});

const updated = "January 2026";

function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHeader kicker="Legal" title="Privacy Policy" subtitle={`Last updated: ${updated}`} />
      <article className="mx-auto max-w-3xl px-6 py-16 prose-content">
        <Section title="1. Who we are">
          SautiApex Capital Ventures Limited (“SautiApex”, “we”, “us”) is a strategy and systems
          consultancy registered in Kenya. We can be reached at{" "}
          <a href="mailto:info@sautiapex.co.ke">info@sautiapex.co.ke</a>.
        </Section>
        <Section title="2. Information we collect">
          <ul>
            <li>
              <strong>Account data:</strong> name, email, phone number, organisation.
            </li>
            <li>
              <strong>Engagement data:</strong> documents, project notes, communications you share
              with us.
            </li>
            <li>
              <strong>Technical data:</strong> IP address, browser, device, pages visited.
            </li>
          </ul>
        </Section>
        <Section title="3. How we use your information">
          <ul>
            <li>To deliver and manage the services you've engaged us for.</li>
            <li>To authenticate you and secure your account.</li>
            <li>To meet legal, accounting and regulatory obligations.</li>
            <li>To communicate updates relevant to your engagement.</li>
          </ul>
        </Section>
        <Section title="4. Lawful basis">
          We process personal data on the basis of contract, legitimate interest, your consent, and
          compliance with applicable law (including the Kenya Data Protection Act, 2019 and GDPR
          where applicable).
        </Section>
        <Section title="5. Sharing">
          We do not sell personal data. We share information only with service providers strictly
          necessary to operate the portal (hosting, authentication, email delivery), all bound by
          confidentiality.
        </Section>
        <Section title="6. Retention">
          We keep client data for the duration of the engagement plus any period required by law.
          You may request deletion at any time.
        </Section>
        <Section title="7. Your rights">
          You may access, correct, export or delete your personal data, and object to or restrict
          certain processing. Contact{" "}
          <a href="mailto:privacy@sautiapex.co.ke">privacy@sautiapex.co.ke</a>.
        </Section>
        <Section title="8. Security">
          All data is encrypted in transit (TLS) and at rest. Access is role-based and logged. We
          will notify you promptly of any incident affecting your personal data.
        </Section>
        <Section title="9. Changes">
          We will post any changes to this policy on this page and, where significant, notify you by
          email.
        </Section>
      </article>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-serif text-xl text-brand-navy mb-3">{title}</h2>
      <div className="text-sm text-foreground/80 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-brand-navy [&_a]:underline">
        {children}
      </div>
    </section>
  );
}
