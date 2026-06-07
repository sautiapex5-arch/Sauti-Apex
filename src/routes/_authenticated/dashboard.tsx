import { createFileRoute, Outlet, Link, useLocation, Navigate } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/site/ClientSidebar";
import { PortalFooter, PortalTopbar } from "@/components/site/PortalTopbar";
import { useAuth } from "@/lib/auth-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AppraisalForm } from "@/components/site/AppraisalForm";
import { ensureClientOnboarding } from "@/lib/onboarding.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

const labels: Record<string, string> = {
  "": "Overview",
  projects: "My Projects",
  consultations: "Consultations",
  invoices: "Invoices",
  documents: "Documents",
  packages: "Packages & Pricing",
  support: "Support",
  profile: "Profile",
};

function DashboardLayout() {
  const { isAuthenticated, loading, hasAdminRole, viewMode, user } = useAuth();
  const loc = useLocation();
  const qc = useQueryClient();
  const ensureOnboarding = useServerFn(ensureClientOnboarding);

  const { data: onboarding } = useQuery({
    queryKey: ["client-onboarding", user?.id],
    enabled: !!user && !(hasAdminRole && viewMode === "admin"),
    queryFn: () => ensureOnboarding(),
  });

  if (loading) return <div className="p-12 text-muted-foreground">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  // Admins viewing as admin should go to the admin console
  if (hasAdminRole && viewMode === "admin") return <Navigate to="/admin" />;

  const slug = loc.pathname.replace(/^\/dashboard\/?/, "").split("/")[0] ?? "";
  const current = labels[slug] ?? "Overview";

  return (
    <SidebarProvider defaultOpen={true} className="min-h-svh">
      <div className="flex min-h-svh w-full">
        <ClientSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <PortalTopbar
            title={current}
            subtitle="Client workspace for projects, consultations, documents and billing."
            mode="client"
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
              <Link to="/dashboard" className="hover:text-brand-navy">
                Portal
              </Link>
              {current !== "Overview" && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="truncate text-brand-navy">{current}</span>
                </>
              )}
            </div>
            <div className="min-w-0">
              <Outlet />
            </div>
          </main>
          <PortalFooter />
        </div>
      </div>
      <Dialog open={!!onboarding?.onboardingRequired}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-5xl overflow-y-auto p-4 sm:p-6">
          <AppraisalForm
            defaultEmail={onboarding?.email ?? user?.email ?? ""}
            defaultName={onboarding?.displayName ?? user?.email?.split("@")[0] ?? ""}
            compact
            onSubmitted={() => qc.invalidateQueries({ queryKey: ["client-onboarding", user?.id] })}
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
