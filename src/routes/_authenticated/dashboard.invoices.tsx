import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/invoices")({
  component: InvoicesPage,
});

function InvoicesPage() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["client-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (rows.length === 0)
    return <p className="text-muted-foreground">No invoices or quotations yet.</p>;

  return (
    <div className="rounded-lg border overflow-x-auto -mx-2 px-0 sm:mx-0">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-3 py-2 text-left">Reference</th>
            <th className="px-3 py-2 text-left">Type</th>
            <th className="px-3 py-2 text-left">Issued</th>
            <th className="px-3 py-2 text-left">Due</th>
            <th className="px-3 py-2 text-left">Total</th>
            <th className="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => {
            const isQuote = r.status === "quotation";
            return (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 font-medium">
                  {r.invoice_no ?? r.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isQuote ? "bg-brand-cream text-brand-navy" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isQuote ? "Quotation" : "Invoice"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {r.issued_at ? new Date(r.issued_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-3 py-2">{r.due_date ?? "—"}</td>
                <td className="px-3 py-2">
                  {r.total != null
                    ? `${r.currency ?? "Ksh"} ${Number(r.total).toLocaleString()}`
                    : "—"}
                </td>
                <td className="px-3 py-2 capitalize">{r.status ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
