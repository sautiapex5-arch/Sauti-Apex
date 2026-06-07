import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — SautiApex Capital Ventures Limited" }] }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <PageHeader
        kicker="Engage Us"
        title="Start with a diagnostic. End with a structure that scales."
        subtitle="Tell us where the chaos is. We'll show you where the structure goes."
      />
      <section className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-[1fr_1.4fr] gap-12">
        <aside className="space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-brand-navy">Headquarters</h3>
            <p className="mt-3 text-muted-foreground text-sm">
              Sautiapex Capital Ventures Limited
              <br />
              Nairobi, Kenya
            </p>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 text-brand-gold-deep" />
              <span className="text-sm">Nairobi, Kenya</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-1 text-brand-gold-deep" />
              <span className="text-sm">info@sautiapex.co.ke</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-1 text-brand-gold-deep" />
              <span className="text-sm">+254 700 000 000</span>
            </li>
          </ul>
          <div className="rounded-xl bg-brand-cream border border-brand-gold/30 p-6">
            <div className="text-xs uppercase tracking-wider text-brand-gold-deep font-semibold">
              Office Hours
            </div>
            <div className="mt-2 text-sm text-brand-navy">Mon – Fri · 08:30 – 17:30 EAT</div>
            <div className="mt-1 text-sm text-muted-foreground">Saturday by appointment</div>
          </div>
        </aside>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="border border-border rounded-2xl bg-card p-8 space-y-5"
        >
          {sent ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-brand-gold/20 flex items-center justify-center">
                <Send className="text-brand-gold-deep" />
              </div>
              <h3 className="mt-5 font-serif text-2xl text-brand-navy">Message received.</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                A consultant will be in touch within 1 business day.
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" name="name" required />
                <Field label="Organization" name="org" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Service Interest
                </label>
                <select className="mt-2 w-full border border-input rounded-md bg-background px-4 py-3 text-sm focus:outline-none focus:border-brand-gold">
                  <option>Strategic Consultancy</option>
                  <option>Capital Structuring & Investment Readiness</option>
                  <option>Tendering & Procurement Support</option>
                  <option>Systems & Automation</option>
                  <option>Leadership & Coaching</option>
                  <option>Grassroots Intelligence</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Tell us about your situation
                </label>
                <textarea
                  rows={5}
                  className="mt-2 w-full border border-input rounded-md bg-background px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-7 py-3.5 text-sm font-semibold text-brand-cream hover:bg-brand-navy-deep transition"
              >
                Send Message <Send size={15} />
              </button>
            </>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
        {label}
        {required && " *"}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full border border-input rounded-md bg-background px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
      />
    </div>
  );
}
