import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { AppraisalForm } from "@/components/site/AppraisalForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/projects")({
  component: ProjectsPage,
});

type ProjectRow = {
  id: string;
  project_name: string;
  status: string;
  description?: string | null;
  progress_percent: number;
  clients?: { company_name?: string | null } | null;
};

function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["client-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, clients(company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Start a new project request and the SautiApex team will review pricing before onboarding
          the delivery team.
        </p>
        <Dialog>
          <DialogTrigger className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-cream">
            + New project appraisal
          </DialogTrigger>
          <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-5xl overflow-y-auto p-4 sm:p-6">
            <AppraisalForm
              defaultEmail={user?.email ?? ""}
              defaultName={user?.email?.split("@")[0] ?? ""}
              requestType="new_project"
              compact
            />
          </DialogContent>
        </Dialog>
      </div>
      {projects.length === 0 && (
        <p className="text-muted-foreground">No approved projects assigned yet.</p>
      )}
      {(projects as ProjectRow[]).map((p) => (
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
              {p.description && <p className="mt-2 text-sm text-foreground/80">{p.description}</p>}
            </div>
            <div className="text-right min-w-[140px]">
              <div className="text-xs text-muted-foreground">{p.progress_percent}% complete</div>
              <div className="mt-1 h-2 w-32 bg-muted rounded overflow-hidden">
                <div className="h-full bg-brand-gold" style={{ width: `${p.progress_percent}%` }} />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
