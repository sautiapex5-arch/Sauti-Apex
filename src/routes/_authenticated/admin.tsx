import { createFileRoute, Outlet, Navigate, useLocation, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/site/AdminSidebar";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const sectionLabels: Record<string, string> = {
  "": "Overview",
  "team-management": "Team",
  clients: "Clients",
  appraisals: "Appraisals",
  leads: "Leads",
  consultations: "Consultations",
  proposals: "Proposals",
  contracts: "Contracts",
  projects: "Projects",
  invoices: "Invoices",
  expenses: "Expenses",
  retainers: "Retainers",
  tenders: "Tenders",
  investments: "Investments",
  compliance: "Compliance",
  packages: "Packages",
  documents: "Documents",
  reports: "Reports",
  "ai-insights": "AI Insights",
  notifications: "Notifications",
  users: "Users & Roles",
};

function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="p-12 text-muted-foreground">Loading…</div>;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  const slug = loc.pathname.replace(/^\/admin\/?/, "").split("/")[0] ?? "";
  const current = sectionLabels[slug] ?? "Overview";

  return (
    <SidebarProvider
      defaultOpen={true}
      className="min-h-[calc(100svh-var(--portal-nav-height))]"
    >
      <div className="flex w-full min-h-[calc(100svh-var(--portal-nav-height))]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pt-safe">
            <SidebarTrigger />
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-brand-gold-deep min-w-0">
              <Link to="/admin" className="hover:text-brand-navy shrink-0">
                Admin
              </Link>
              {current !== "Overview" && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-brand-navy truncate">{current}</span>
                </>
              )}
            </div>
          </div>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="font-serif text-3xl text-brand-navy">{current}</h1>
            <div className="mt-6 min-w-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
