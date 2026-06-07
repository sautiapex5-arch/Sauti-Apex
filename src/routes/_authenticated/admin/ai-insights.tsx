import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/ai-insights")({
  component: AIInsightsPage,
});

function AIInsightsPage() {
  const qc = useQueryClient();
  const { data: insights = [] } = useQuery({
    queryKey: ["ai-insights"],
    queryFn: async () =>
      (
        await supabase
          .from("ai_insights")
          .select("*, clients(company_name)")
          .order("generated_at", { ascending: false })
      ).data ?? [],
  });

  const generate = useMutation({
    mutationFn: async () => {
      const { data: clients } = await supabase.from("clients").select("id, company_name").limit(5);
      if (!clients?.length) throw new Error("Add clients first");
      const samples = [
        {
          title: "Tax compliance missing",
          description: "KRA tax compliance certificate not on file. Renewal required.",
          priority: "high",
        },
        {
          title: "Tender opportunity matched",
          description: "New tender matches client's AGPO profile.",
          priority: "medium",
        },
        {
          title: "Cashflow risk detected",
          description: "Invoice aging > 60 days. Follow up recommended.",
          priority: "high",
        },
        {
          title: "Expansion readiness improved",
          description: "Digital maturity score increased to 72%.",
          priority: "low",
        },
      ];
      const rows = clients.flatMap((c) =>
        samples.slice(0, 2).map((s) => ({
          client_id: c.id,
          ...s,
          insight_type: "auto",
          action_required: s.priority === "high",
        })),
      );
      const { error } = await supabase.from("ai_insights").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Insights generated (sample)");
      qc.invalidateQueries({ queryKey: ["ai-insights"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resolve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ai_insights").update({ resolved: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-insights"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-brand-navy">Sauti AI Insights</h2>
        <button
          onClick={() => generate.mutate()}
          disabled={generate.isPending}
          className="rounded-md bg-brand-gold px-4 py-2 text-sm font-medium text-brand-navy"
        >
          {generate.isPending ? "Generating…" : "Generate sample insights"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Sauti AI scans your clients for compliance gaps, cashflow risks, tender matches and growth
        signals. Full LLM-driven generation is configured through Groq AI.
      </p>
      <div className="space-y-2">
        {insights.length === 0 && <p className="text-muted-foreground">No insights yet.</p>}
        {insights.map((i: any) => (
          <div
            key={i.id}
            className={`rounded-lg border p-4 flex items-start gap-3 ${i.resolved ? "opacity-50" : ""}`}
          >
            {i.priority === "high" ? (
              <AlertTriangle className="text-destructive shrink-0" size={18} />
            ) : (
              <CheckCircle2 className="text-brand-gold-deep shrink-0" size={18} />
            )}
            <div className="flex-1">
              <div className="font-medium">
                {i.title}{" "}
                <span className="text-xs text-muted-foreground">· {i.clients?.company_name}</span>
              </div>
              <div className="text-sm text-muted-foreground">{i.description}</div>
            </div>
            {!i.resolved && (
              <button
                onClick={() => resolve.mutate(i.id)}
                className="text-xs border px-2 py-1 rounded"
              >
                Resolve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
