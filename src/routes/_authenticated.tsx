import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SplashScreen } from "@/components/site/SplashScreen";
import { CookieConsent } from "@/components/site/CookieConsent";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
          Loading…
        </div>
      </SiteLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <SiteLayout>
        <section className="min-h-[60vh] flex items-center bg-brand-cream/40">
          <div className="mx-auto max-w-md text-center px-6 py-16">
            <h1 className="font-serif text-3xl text-brand-navy">Sign in to continue</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              This area is for registered entities only.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link
                to="/login"
                className="rounded-md bg-brand-navy text-brand-cream px-5 py-2.5 text-sm font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/intake"
                className="rounded-md border border-brand-navy text-brand-navy px-5 py-2.5 text-sm font-semibold"
              >
                Start Intake
              </Link>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <div className="min-h-screen-safe bg-background text-foreground">
      <SplashScreen />
      <Outlet />
      <CookieConsent />
    </div>
  );
}
