import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Menu, X, Shield, User as UserIcon } from "lucide-react";
import { useRef, useState, type MouseEventHandler } from "react";
import { useAuth } from "@/lib/auth-context";
import { SignOutButton } from "./SignOutButton";
import { armSplash } from "./SplashScreen";
import { GroqSecretSettingsDialog } from "./GroqSecretSettingsDialog";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/approach", label: "Approach" },
  { to: "/sectors", label: "Sectors" },
  { to: "/team", label: "Our Team" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef<number | undefined>(undefined);
  const { isAuthenticated, isAdmin, hasAdminRole, viewMode, setViewMode } = useAuth();
  const navigate = useNavigate();

  // Admins in admin view get a compact grouped menu instead of the public link bar.
  const showAdminMenu = isAdmin;
  const links = showAdminMenu
    ? []
    : isAuthenticated
      ? [publicLinks[0], { to: "/dashboard", label: "Dashboard" }, ...publicLinks.slice(1)]
      : publicLinks;

  const toggleView = () => {
    const next = viewMode === "admin" ? "client" : "admin";
    setViewMode(next);
    navigate({ to: next === "admin" ? "/admin" : "/dashboard" });
  };

  const handleLogoClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (!hasAdminRole) return;
    event.preventDefault();

    logoTapCount.current += 1;
    if (logoTapTimer.current) window.clearTimeout(logoTapTimer.current);

    if (logoTapCount.current >= 5) {
      logoTapCount.current = 0;
      setSecretOpen(true);
      return;
    }

    logoTapTimer.current = window.setTimeout(() => {
      logoTapCount.current = 0;
    }, 1600);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl pt-safe px-safe">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo onClick={handleLogoClick} />
          <nav className={`${isAuthenticated ? "hidden" : "hidden md:flex"} items-center gap-1`}>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3.5 py-2 text-sm font-medium text-foreground/75 rounded-md transition hover:text-brand-navy hover:bg-secondary"
                activeProps={{ className: "text-brand-navy bg-secondary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            {hasAdminRole && (
              <button
                onClick={toggleView}
                title={`Currently viewing as ${viewMode}. Click to switch.`}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-gold/20 transition"
              >
                {viewMode === "admin" ? (
                  <Shield size={13} className="text-brand-gold-deep" />
                ) : (
                  <UserIcon size={13} />
                )}
                {viewMode === "admin" ? "Admin view" : "Client view"}
              </button>
            )}

            {isAuthenticated ? (
              <>
                <SignOutButton />
                <button
                  onClick={() => setOpen(!open)}
                  aria-label="Menu"
                  className="inline-flex items-center justify-center rounded-md border border-border p-2 text-brand-navy hover:bg-secondary transition"
                >
                  {open ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={armSplash}
                  className="px-4 py-2 text-sm font-semibold text-brand-navy hover:text-brand-gold-deep transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/intake"
                  onClick={armSplash}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-gold-deep transition"
                >
                  Start Intake
                </Link>
              </>
            )}
          </div>
          <button
            className="md:hidden p-2 text-brand-navy"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div
            className={`${isAuthenticated ? "" : "md:hidden"} border-t border-border bg-background`}
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {(showAdminMenu
                ? [
                    { to: "/admin", label: "Admin Overview" },
                    { to: "/dashboard", label: "Client view" },
                  ]
                : links
              ).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium text-foreground/80"
                >
                  {l.label}
                </Link>
              ))}
              {showAdminMenu && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {[
                    ["/admin/leads", "Leads"],
                    ["/admin/clients", "Clients"],
                    ["/admin/projects", "Projects"],
                    ["/admin/proposals", "Proposals"],
                    ["/admin/contracts", "Contracts"],
                    ["/admin/invoices", "Invoices"],
                    ["/admin/expenses", "Expenses"],
                    ["/admin/retainers", "Retainers"],
                    ["/admin/tenders", "Tenders"],
                    ["/admin/investments", "Investments"],
                    ["/admin/compliance", "Compliance"],
                    ["/admin/packages", "Packages"],
                    ["/admin/team-management", "Team"],
                    ["/admin/consultations", "Consultations"],
                    ["/admin/documents", "Documents"],
                    ["/admin/reports", "Reports"],
                    ["/admin/ai-insights", "AI Insights"],
                    ["/admin/notifications", "Notifications"],
                    ["/admin/users", "Users & Roles"],
                  ].map(([to, label]) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className="py-1.5 text-xs text-foreground/70"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
              {isAuthenticated ? (
                <div className="mt-2">
                  <SignOutButton
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold"
                    onAfter={() => setOpen(false)}
                  />
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => {
                      armSplash();
                      setOpen(false);
                    }}
                    className="py-2 text-sm font-semibold text-brand-navy"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/intake"
                    onClick={() => {
                      armSplash();
                      setOpen(false);
                    }}
                    className="mt-2 rounded-md bg-brand-gold px-4 py-2.5 text-center text-sm font-semibold text-brand-navy"
                  >
                    Start Intake
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      {hasAdminRole && <GroqSecretSettingsDialog open={secretOpen} onOpenChange={setSecretOpen} />}
    </>
  );
}
