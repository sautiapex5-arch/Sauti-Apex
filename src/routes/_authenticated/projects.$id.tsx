import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ArrowLeft, Trash2, UserPlus } from "lucide-react";
import { ProjectThread } from "@/components/site/ProjectThread";

export const Route = createFileRoute("/_authenticated/projects/$id")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { id } = Route.useParams();
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const [newMember, setNewMember] = useState({ user_id: "", role_on_project: "" });

  const { data: project } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, clients(company_name)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: members = [] } = useQuery({
    queryKey: ["project-members", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_members")
        .select("*, profiles:user_id(display_name, contact_email)")
        .eq("project_id", id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["project-invoices", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["staff-list"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("user_id, role, profiles:user_id(display_name)");
      return (data ?? []).filter((r: any) =>
        [
          "admin",
          "team",
          "consultant",
          "ops_manager",
          "project_manager",
          "ceo",
          "hr_officer",
          "finance_officer",
        ].includes(r.role),
      );
    },
  });

  const addMember = useMutation({
    mutationFn: async () => {
      if (!newMember.user_id) throw new Error("Pick a team member");
      const { error } = await supabase.from("project_members").insert({
        project_id: id,
        ...newMember,
        role_on_project: newMember.role_on_project || "member",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Added");
      setNewMember({ user_id: "", role_on_project: "" });
      qc.invalidateQueries({ queryKey: ["project-members", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase.from("project_members").delete().eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project-members", id] }),
  });

  if (!project) return <div className="mx-auto max-w-5xl p-8 text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to={isAdmin ? "/admin/projects" : "/dashboard"}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-navy"
      >
        <ArrowLeft size={14} /> Back
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
        <span>{project.clients?.company_name}</span>
        {project.project_no && (
          <span className="rounded-full bg-brand-navy px-2.5 py-0.5 tracking-normal text-brand-cream">
            {project.project_no}
          </span>
        )}
      </div>
      <h1 className="mt-1 font-serif text-3xl text-brand-navy">{project.project_name}</h1>
      <p className="mt-2 text-muted-foreground">{project.description}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-muted-foreground">Status</div>
          <div className="mt-1 font-medium capitalize">{project.status}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-muted-foreground">Duration</div>
          <div className="mt-1 font-medium">{project.estimated_duration_days ?? "—"} days</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-muted-foreground">Progress</div>
          <div className="mt-1 font-medium">{project.progress_percent}%</div>
          <div className="mt-2 h-2 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-brand-gold"
              style={{ width: `${project.progress_percent}%` }}
            />
          </div>
        </div>
      </div>

      <h2 className="mt-10 font-serif text-xl text-brand-navy">Project team</h2>
      <div className="mt-3 rounded-lg border divide-y">
        {members.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No team members assigned.</p>
        )}
        {members.map((m: any) => (
          <div key={m.id} className="flex items-center justify-between p-3">
            <div>
              <div className="font-medium">{m.profiles?.display_name || "—"}</div>
              <div className="text-xs text-muted-foreground">
                {m.role_on_project} · {m.profiles?.contact_email}
              </div>
            </div>
            {isAdmin && (
              <button onClick={() => removeMember.mutate(m.id)} className="text-destructive p-1">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-4 rounded-lg border border-dashed p-4 flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground">Team member</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={newMember.user_id}
              onChange={(e) => setNewMember({ ...newMember, user_id: e.target.value })}
            >
              <option value="">Select…</option>
              {staff.map((s: any) => (
                <option key={s.user_id} value={s.user_id}>
                  {s.profiles?.display_name || s.user_id.slice(0, 8)} ({s.role})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-muted-foreground">Role on project</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Marketer, IT Lead"
              value={newMember.role_on_project}
              onChange={(e) => setNewMember({ ...newMember, role_on_project: e.target.value })}
            />
          </div>
          <button
            onClick={() => addMember.mutate()}
            className="rounded-md bg-brand-navy text-white px-4 py-2 text-sm inline-flex items-center gap-1"
          >
            <UserPlus size={14} /> Assign
          </button>
        </div>
      )}

      <h2 className="mt-10 font-serif text-xl text-brand-navy">Quotations &amp; invoices</h2>
      <div className="mt-3 rounded-lg border divide-y">
        {invoices.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No quotations or invoices yet.</p>
        )}
        {invoices.map((inv: any) => (
          <div key={inv.id} className="flex items-center justify-between gap-3 p-3 text-sm">
            <div>
              <div className="font-medium text-brand-navy">
                {inv.invoice_no ?? inv.id.slice(0, 8).toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {inv.status === "quotation" ? "Quotation" : "Invoice"} · {inv.status}
              </div>
            </div>
            <div className="font-semibold text-brand-navy">
              {inv.total != null
                ? `${inv.currency ?? "Ksh"} ${Number(inv.total).toLocaleString()}`
                : "—"}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-xl text-brand-navy">Communication &amp; documents</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Message the team or client and exchange documents tied to this project.
      </p>
      <div className="mt-4">
        <ProjectThread projectId={id} clientId={project.client_id} />
      </div>
    </div>
  );
}
