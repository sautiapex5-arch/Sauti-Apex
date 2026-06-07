import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronRight, Search, Users, FileText } from "lucide-react";
import { ProjectThread } from "@/components/site/ProjectThread";
import { DocumentCard } from "@/components/site/DocumentCard";
import { SendDocumentDialog } from "@/components/site/SendDocumentDialog";

export const Route = createFileRoute("/_authenticated/admin/documents")({
  component: AdminDocumentsPage,
});

function AdminDocumentsPage() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-project-hub"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, project_no, project_name, status, progress_percent, estimated_duration_days, client_id, clients(company_name), project_members(id, role_on_project, profiles:user_id(display_name))",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const q = search.trim().toLowerCase();
  const filtered = q
    ? (projects as any[]).filter(
        (p) =>
          (p.project_no ?? "").toLowerCase().includes(q) ||
          (p.project_name ?? "").toLowerCase().includes(q) ||
          (p.clients?.company_name ?? "").toLowerCase().includes(q),
      )
    : (projects as any[]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-brand-navy">
            Project documents &amp; communication
          </h2>
          <p className="text-sm text-muted-foreground">
            Press <span className="font-medium text-brand-navy">Send a document</span> to pick a
            project, choose who receives it, upload a file, optionally polish or brand it with Sauti
            AI, then send.
          </p>
        </div>
        <SendDocumentDialog />
      </div>

      <div className="relative mb-5 max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project no, name or client…"
          className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading projects…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
          {q
            ? "No projects match your search."
            : "No projects yet. Approve an appraisal to open one."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <ProjectHubCard
              key={p.id}
              project={p}
              open={openId === p.id}
              onToggle={() => setOpenId(openId === p.id ? null : p.id)}
            />
          ))}
        </div>
      )}

      <UnassignedDocuments />
    </div>
  );
}

function ProjectHubCard({
  project,
  open,
  onToggle,
}: {
  project: any;
  open: boolean;
  onToggle: () => void;
}) {
  const { data: invoices = [] } = useQuery({
    queryKey: ["hub-invoices", project.id],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="rounded-lg border border-border bg-card">
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        {open ? (
          <ChevronDown size={18} className="text-brand-gold-deep" />
        ) : (
          <ChevronRight size={18} className="text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-base text-brand-navy">{project.project_name}</span>
            {project.project_no && (
              <span className="rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-semibold text-brand-cream">
                {project.project_no}
              </span>
            )}
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
              {project.status}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {project.clients?.company_name} · {project.progress_percent}% complete
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Client" value={project.clients?.company_name} />
            <Info label="Stage" value={project.status} />
            <Info
              label="Duration"
              value={
                project.estimated_duration_days ? `${project.estimated_duration_days} days` : "—"
              }
            />
            <div className="rounded-md border border-border bg-secondary/40 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Progress
              </div>
              <div className="mt-1 text-sm font-semibold text-brand-navy">
                {project.progress_percent}%
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted">
                <div
                  className="h-full bg-brand-gold"
                  style={{ width: `${project.progress_percent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-border p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Users size={13} /> Team
              </div>
              {project.project_members?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {project.project_members.map((m: any) => (
                    <span key={m.id} className="rounded bg-muted px-2 py-0.5 text-xs">
                      {m.profiles?.display_name || "—"} ({m.role_on_project})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No team members assigned.</p>
              )}
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quotations &amp; invoices
              </div>
              {invoices.length === 0 ? (
                <p className="text-xs text-muted-foreground">None yet.</p>
              ) : (
                <ul className="space-y-1 text-xs">
                  {invoices.map((inv: any) => (
                    <li key={inv.id} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">
                        {inv.status === "quotation" ? "Quotation" : "Invoice"} · {inv.status}
                      </span>
                      <span className="font-semibold text-brand-navy">
                        {inv.total != null
                          ? `${inv.currency ?? "Ksh"} ${Number(inv.total).toLocaleString()}`
                          : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <ProjectThread projectId={project.id} clientId={project.client_id} />

          <Link
            to="/projects/$id"
            params={{ id: project.id }}
            className="inline-block text-sm font-semibold text-brand-gold-deep hover:underline"
          >
            Open full project workspace →
          </Link>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-md border border-border bg-secondary/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold capitalize text-brand-navy">{value || "—"}</div>
    </div>
  );
}

function UnassignedDocuments() {
  const [open, setOpen] = useState(false);
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-unassigned-docs"],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .is("project_id", null)
        .order("uploaded_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="mt-8 rounded-lg border border-border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        {open ? (
          <ChevronDown size={18} className="text-brand-gold-deep" />
        ) : (
          <ChevronRight size={18} className="text-muted-foreground" />
        )}
        <FileText size={15} className="text-muted-foreground" />
        <span className="font-serif text-base text-brand-navy">
          General documents (not tied to a project)
        </span>
      </button>
      {open && (
        <div className="border-t border-border p-4">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No unassigned documents.</p>
          ) : (
            <div className="grid gap-3">
              {rows.map((r: any) => (
                <DocumentCard key={r.id} doc={r} canPolish />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
