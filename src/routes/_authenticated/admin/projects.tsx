import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: ProjectsAdminPage,
});

function ProjectsAdminPage() {
  const qc = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    client_id: "",
    project_name: "",
    description: "",
    start_date: "",
    estimated_duration_days: 30,
    status: "planning",
    progress_percent: 0,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "*, clients(company_name), project_members(id, role_on_project, user_id, profiles:user_id(display_name))",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-list"],
    queryFn: async () =>
      (await supabase.from("clients").select("id, company_name").order("company_name")).data ?? [],
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.client_id || !form.project_name)
        throw new Error("Client and project name are required");
      const { error } = await supabase.from("projects").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project created — CEO auto-assigned");
      setShowNew(false);
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateProgress = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const { error } = await supabase
        .from("projects")
        .update({ progress_percent: progress })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-brand-navy">Projects</h2>
        <button
          onClick={() => setShowNew(!showNew)}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm text-white"
        >
          {showNew ? "Cancel" : "+ Onboard Project"}
        </button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="border rounded px-3 py-2"
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
          >
            <option value="">Select client *</option>
            {clients.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.company_name}
              </option>
            ))}
          </select>
          <input
            className="border rounded px-3 py-2"
            placeholder="Project name (e.g. NTSA Automation) *"
            value={form.project_name}
            onChange={(e) => setForm({ ...form, project_name: e.target.value })}
          />
          <textarea
            className="border rounded px-3 py-2 md:col-span-2"
            rows={2}
            placeholder="Scope description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
          <input
            type="number"
            min={1}
            className="border rounded px-3 py-2"
            placeholder="Estimated duration (days)"
            value={form.estimated_duration_days}
            onChange={(e) => setForm({ ...form, estimated_duration_days: Number(e.target.value) })}
          />
          <button
            onClick={() => create.mutate()}
            disabled={create.isPending}
            className="md:col-span-2 rounded-md bg-brand-gold px-4 py-2 text-sm font-medium text-brand-navy"
          >
            {create.isPending ? "Creating…" : "Create project"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {projects.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
        {projects.map((p: any) => (
          <div key={p.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link
                  to="/projects/$id"
                  params={{ id: p.id }}
                  className="font-serif text-lg text-brand-navy hover:underline"
                >
                  {p.project_name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {p.clients?.company_name} · <span className="capitalize">{p.status}</span>{" "}
                  {p.estimated_duration_days && (
                    <>
                      · <Calendar size={12} className="inline" /> {p.estimated_duration_days}d
                    </>
                  )}
                </p>
                {p.description && <p className="mt-2 text-sm">{p.description}</p>}
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Users size={12} /> Team:
                  {p.project_members?.length ? (
                    p.project_members.map((pm: any) => (
                      <span key={pm.id} className="px-2 py-0.5 bg-muted rounded">
                        {pm.profiles?.display_name || "—"} ({pm.role_on_project})
                      </span>
                    ))
                  ) : (
                    <span>none assigned</span>
                  )}
                </div>
              </div>
              <div className="text-right min-w-[160px]">
                <div className="text-xs text-muted-foreground mb-1">
                  Progress: {p.progress_percent}%
                </div>
                <div className="h-2 w-40 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-brand-gold"
                    style={{ width: `${p.progress_percent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={p.progress_percent}
                  onChange={(e) =>
                    updateProgress.mutate({ id: p.id, progress: Number(e.target.value) })
                  }
                  className="mt-2 w-40"
                />
                <div className="mt-2">
                  <Link
                    to="/projects/$id"
                    params={{ id: p.id }}
                    className="text-xs text-brand-gold-deep hover:underline"
                  >
                    Manage team →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
