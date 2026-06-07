import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DocumentCard } from "@/components/site/DocumentCard";

export const Route = createFileRoute("/_authenticated/dashboard/documents")({
  component: DocumentsPage,
});

function DocumentsPage() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["client-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (rows.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
        No documents shared yet.
      </div>
    );

  return (
    <div className="grid gap-3">
      {rows.map((r: any) => (
        <DocumentCard key={r.id} doc={r} />
      ))}
    </div>
  );
}
