import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/support")({
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm text-muted-foreground">
        Need help with your engagement? Reach your consultant through any of the channels below.
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        <a
          href="mailto:info@sautiapex.co.ke"
          className="rounded-xl border border-border bg-card p-4 hover:border-brand-gold/50 transition"
        >
          <Mail className="text-brand-gold-deep" size={18} />
          <div className="mt-2 font-serif text-lg text-brand-navy">Email</div>
          <div className="text-xs text-muted-foreground break-all">info@sautiapex.co.ke</div>
        </a>
        <a
          href="tel:+254000000000"
          className="rounded-xl border border-border bg-card p-4 hover:border-brand-gold/50 transition"
        >
          <Phone className="text-brand-gold-deep" size={18} />
          <div className="mt-2 font-serif text-lg text-brand-navy">Phone</div>
          <div className="text-xs text-muted-foreground">+254 000 000 000</div>
        </a>
        <Link
          to="/contact"
          className="rounded-xl border border-border bg-card p-4 hover:border-brand-gold/50 transition"
        >
          <MessageCircle className="text-brand-gold-deep" size={18} />
          <div className="mt-2 font-serif text-lg text-brand-navy">Contact form</div>
          <div className="text-xs text-muted-foreground">Send a request</div>
        </Link>
      </div>
    </div>
  );
}
