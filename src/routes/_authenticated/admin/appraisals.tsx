import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { reviewClientAppraisal } from "@/lib/onboarding.functions";

type AppraisalRow = {
  id: string;
  project_name?: string | null;
  company_name?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  status: string;
  request_type?: string | null;
  recommended_package?: string | null;
  estimated_price_range?: string | null;
  preferred_budget_range?: string | null;
  challenges?: string | null;
  expected_outcomes?: string | null;
  objectives?: string[] | null;
  required_systems?: string[] | null;
  project_id?: string | null;
  admin_notes?: string | null;
};

export const Route = createFileRoute("/_authenticated/admin/appraisals")({
  component: AppraisalsPage,
});

function AppraisalsPage() {
  const qc = useQueryClient();
  const review = useServerFn(reviewClientAppraisal);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const { data: appraisals = [], isLoading } = useQuery({
    queryKey: ["admin-appraisals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_appraisals")
        .select("*, clients(company_name), projects(project_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const decide = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "approved" | "rejected" }) =>
      review({ data: { id, decision, admin_notes: notes[id] ?? "" } }),
    onSuccess: (_, vars) => {
      toast.success(
        vars.decision === "approved"
          ? "Appraisal approved and project opened"
          : "Appraisal rejected",
      );
      qc.invalidateQueries({ queryKey: ["admin-appraisals"] });
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading appraisals…</p>;

  return (
    <div className="space-y-4">
      {appraisals.length === 0 && (
        <p className="text-muted-foreground">No client appraisals yet.</p>
      )}
      {(appraisals as AppraisalRow[]).map((a) => (
        <article key={a.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl text-brand-navy">
                  {a.project_name || a.company_name || a.full_name}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                  {a.status}
                </span>
                <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs text-brand-navy">
                  {a.request_type?.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {a.full_name} · {a.email} {a.phone ? `· ${a.phone}` : ""}
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <Mini label="Recommended package" value={a.recommended_package} />
                <Mini label="Estimated range" value={a.estimated_price_range} />
                <Mini label="Budget" value={a.preferred_budget_range} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Detail label="Challenges" value={a.challenges} />
                <Detail label="Expected outcomes" value={a.expected_outcomes} />
                <Detail label="Objectives" value={a.objectives?.join(", ")} />
                <Detail label="Required systems" value={a.required_systems?.join(", ")} />
              </div>
              {a.project_id && (
                <Link
                  to="/projects/$id"
                  params={{ id: a.project_id }}
                  className="mt-3 inline-block text-sm font-semibold text-brand-gold-deep hover:underline"
                >
                  Open project →
                </Link>
              )}
            </div>
            <div className="w-full lg:w-80">
              <textarea
                value={notes[a.id] ?? a.admin_notes ?? ""}
                onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })}
                rows={3}
                placeholder="CEO/admin notes"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  disabled={decide.isPending || a.status === "approved"}
                  onClick={() => decide.mutate({ id: a.id, decision: "approved" })}
                  className="inline-flex items-center justify-center gap-1 rounded-md bg-brand-gold px-3 py-2 text-sm font-semibold text-brand-navy disabled:opacity-50"
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  disabled={decide.isPending || a.status === "rejected"}
                  onClick={() => decide.mutate({ id: a.id, decision: "rejected" })}
                  className="inline-flex items-center justify-center gap-1 rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive disabled:opacity-50"
                >
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Mini({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-md border border-border bg-secondary/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-brand-navy">{value || "—"}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <p className="mt-1 text-sm text-foreground/80">{value || "—"}</p>
    </div>
  );
}
