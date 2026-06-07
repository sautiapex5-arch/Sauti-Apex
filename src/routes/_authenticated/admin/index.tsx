import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-serif text-3xl text-brand-navy">{value}</div>
    </div>
  );
}

function AdminOverview() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [clients, leads, projects, invoices, proposals, appraisals, insights] =
        await Promise.all([
          supabase.from("clients").select("id", { count: "exact", head: true }),
          supabase.from("leads").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }),
          supabase.from("invoices").select("id", { count: "exact", head: true }),
          supabase.from("proposals").select("id", { count: "exact", head: true }),
          supabase
            .from("client_appraisals")
            .select("id", { count: "exact", head: true })
            .eq("status", "submitted"),
          supabase
            .from("ai_insights")
            .select("id", { count: "exact", head: true })
            .eq("resolved", false),
        ]);
      return {
        clients: clients.count ?? 0,
        leads: leads.count ?? 0,
        projects: projects.count ?? 0,
        invoices: invoices.count ?? 0,
        proposals: proposals.count ?? 0,
        appraisals: appraisals.count ?? 0,
        openInsights: insights.count ?? 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Welcome to the Sautiapex operations console. The full 20-module platform schema is live —
        admin pages for each module are being built out.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Clients" value={data?.clients ?? "—"} />
        <StatCard label="Leads" value={data?.leads ?? "—"} />
        <StatCard label="Projects" value={data?.projects ?? "—"} />
        <StatCard label="Proposals" value={data?.proposals ?? "—"} />
        <StatCard label="Pending Appraisals" value={data?.appraisals ?? "—"} />
        <StatCard label="Invoices" value={data?.invoices ?? "—"} />
        <StatCard label="Open AI Insights" value={data?.openInsights ?? "—"} />
      </div>
    </div>
  );
}
