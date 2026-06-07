import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { CookieConsent } from "./CookieConsent";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen-safe flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1 px-safe">{children}</main>
      <div className="pb-safe px-safe">
        <Footer />
      </div>
      <CookieConsent />
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-navy-gradient text-brand-cream relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        {kicker && (
          <div className="text-xs font-medium tracking-[0.25em] uppercase text-brand-gold mb-5">
            {kicker}
          </div>
        )}
        <h1 className="font-serif text-4xl md:text-6xl font-semibold max-w-4xl leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg text-brand-cream/75 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
