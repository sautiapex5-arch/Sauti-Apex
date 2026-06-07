import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/consultations")({
  component: ConsultationsPage,
});

function ConsultationsPage() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["client-consultations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .order("scheduled_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (rows.length === 0)
    return <p className="text-muted-foreground">No consultations scheduled yet.</p>;

  return (
    <div className="grid gap-3">
      {rows.map((r: any) => (
        <div key={r.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-serif text-lg text-brand-navy">{r.topic ?? "Consultation"}</div>
              <div className="text-sm text-muted-foreground">
                {r.scheduled_at ? new Date(r.scheduled_at).toLocaleString() : "Not scheduled"}
              </div>
              {r.notes && <p className="mt-2 text-sm text-foreground/80">{r.notes}</p>}
            </div>
            <span className="text-xs capitalize rounded-full px-2 py-1 bg-brand-cream text-brand-navy">
              {r.status ?? "—"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
