import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Folder, Receipt, CalendarCheck, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { user } = useAuth();

  const { data: projects = [] } = useQuery({
    queryKey: ["my-projects", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, clients(company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: counts } = useQuery({
    queryKey: ["client-overview-counts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [inv, con, doc] = await Promise.all([
        supabase.from("invoices").select("id", { count: "exact", head: true }),
        supabase.from("consultations").select("id", { count: "exact", head: true }),
        supabase.from("documents").select("id", { count: "exact", head: true }),
      ]);
      return { invoices: inv.count ?? 0, consultations: con.count ?? 0, documents: doc.count ?? 0 };
    },
  });

  const stats = [
    { label: "Projects", value: projects.length, to: "/dashboard/projects", Icon: Folder },
    { label: "Invoices", value: counts?.invoices ?? 0, to: "/dashboard/invoices", Icon: Receipt },
    {
      label: "Consultations",
      value: counts?.consultations ?? 0,
      to: "/dashboard/consultations",
      Icon: CalendarCheck,
    },
    {
      label: "Documents",
      value: counts?.documents ?? 0,
      to: "/dashboard/documents",
      Icon: FileText,
    },
  ];

  return (
    <div>
      <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-xl border border-border bg-card p-4 hover:border-brand-gold/50 transition"
          >
            <s.Icon className="text-brand-gold-deep" size={18} />
            <div className="mt-2 font-serif text-2xl text-brand-navy">{s.value}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-xl text-brand-navy">Recent projects</h2>
      {projects.length === 0 ? (
        <p className="mt-3 text-muted-foreground text-sm">
          No projects yet. Your consultant will set one up after intake.
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {projects.slice(0, 5).map((p: any) => (
            <Link
              key={p.id}
              to="/projects/$id"
              params={{ id: p.id }}
              className="rounded-lg border border-border bg-card p-4 hover:shadow transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-serif text-lg text-brand-navy">{p.project_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.clients?.company_name} · <span className="capitalize">{p.status}</span>
                  </div>
                </div>
                <div className="text-right min-w-[140px]">
                  <div className="text-xs text-muted-foreground">
                    {p.progress_percent}% complete
                  </div>
                  <div className="mt-1 h-2 w-32 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-brand-gold"
                      style={{ width: `${p.progress_percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
