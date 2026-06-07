import { createFileRoute, Outlet, Navigate, useLocation, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/site/AdminSidebar";
import { PortalFooter, PortalTopbar } from "@/components/site/PortalTopbar";

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
    <SidebarProvider defaultOpen={true} className="min-h-svh">
      <div className="flex min-h-svh w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <PortalTopbar
            title={current}
            subtitle="Operational overview across clients, projects, finance and delivery."
            mode="admin"
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
              <Link to="/admin" className="hover:text-brand-navy">
                Admin
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
    </SidebarProvider>
  );
}
