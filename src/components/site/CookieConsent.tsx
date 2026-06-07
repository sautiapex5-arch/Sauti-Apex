import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const KEY = "sautiapex.cookieConsent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(KEY)) setVisible(true);
  }, []);

  const decide = (value: "accepted" | "essential") => {
    window.localStorage.setItem(KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4"
    >
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card shadow-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie size={20} className="text-brand-gold-deep mt-0.5 shrink-0" />
          <p className="text-sm text-foreground/85 leading-relaxed">
            We use essential cookies to keep the site secure and remember your preferences. With
            your consent, we may use analytics cookies to improve our service. Read our{" "}
            <Link to="/cookies" className="underline hover:text-brand-navy">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => decide("essential")}
            className="flex-1 md:flex-none rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
          >
            Essential only
          </button>
          <button
            onClick={() => decide("accepted")}
            className="flex-1 md:flex-none rounded-md bg-brand-navy text-brand-cream px-4 py-2 text-sm font-semibold hover:bg-brand-navy-deep transition"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
