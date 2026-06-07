import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
  head: () => ({
    meta: [
      { title: "Cookie Policy — SautiApex" },
      {
        name: "description",
        content: "How SautiApex uses cookies and similar technologies on this site.",
      },
      { property: "og:title", content: "Cookie Policy — SautiApex" },
      {
        property: "og:description",
        content: "How SautiApex uses cookies and similar technologies on this site.",
      },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
});

const updated = "January 2026";

function CookiesPage() {
  return (
    <SiteLayout>
      <PageHeader kicker="Legal" title="Cookie Policy" subtitle={`Last updated: ${updated}`} />
      <article className="mx-auto max-w-3xl px-6 py-16 space-y-8 text-sm text-foreground/80 leading-relaxed">
        <p>
          Cookies are small text files stored on your device when you visit a website. We use them
          sparingly and only for the purposes below.
        </p>

        <div>
          <h2 className="font-serif text-xl text-brand-navy mb-3">Essential cookies</h2>
          <p>
            Required for the site and client portal to function — session authentication, security,
            and remembering your preferences (such as your view mode). These cannot be disabled.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-brand-navy mb-3">Analytics cookies (optional)</h2>
          <p>
            With your consent we may use privacy-respecting analytics to understand which pages are
            useful and to improve our service. We don't sell or share this data.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-brand-navy mb-3">Managing cookies</h2>
          <p>
            You can change your choice at any time by clearing site data in your browser. Most
            browsers also let you block cookies entirely from their privacy settings.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-brand-navy mb-3">Contact</h2>
          <p>
            Questions about cookies? Email{" "}
            <a href="mailto:privacy@sautiapex.co.ke" className="text-brand-navy underline">
              privacy@sautiapex.co.ke
            </a>
            .
          </p>
        </div>
      </article>
    </SiteLayout>
  );
}
