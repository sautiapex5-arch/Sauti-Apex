import { ReactNode, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
};

export function EntityListPage({
  title,
  table,
  fields,
  columns,
  orderBy = "created_at",
  defaults = {},
}: {
  title: string;
  table: string;
  fields: Field[];
  columns: { key: string; label: string; render?: (row: any) => ReactNode }[];
  orderBy?: string;
  defaults?: Record<string, any>;
}) {
  const qc = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const blank = fields.reduce((a, f) => ({ ...a, [f.key]: "" }), {} as Record<string, any>);
  const [form, setForm] = useState<Record<string, any>>(blank);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: [`entity-${table}`],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from(table as any)
        .select("*")
        .order(orderBy, { ascending: false }) as any);
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const payload: Record<string, any> = { ...defaults };
      for (const f of fields) {
        const v = form[f.key];
        if (f.required && (v === "" || v == null)) throw new Error(`${f.label} is required`);
        if (v !== "" && v != null) payload[f.key] = f.type === "number" ? Number(v) : v;
      }
      const { error } = await (supabase.from(table as any).insert(payload) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Created");
      setShowNew(false);
      setForm(blank);
      qc.invalidateQueries({ queryKey: [`entity-${table}`] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-brand-navy">{title}</h2>
        <button
          onClick={() => setShowNew(!showNew)}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm text-white"
        >
          {showNew ? "Cancel" : "+ New"}
        </button>
      </div>
      {showNew && (
        <div className="mb-6 rounded-lg border bg-card p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="text-xs text-muted-foreground">
                {f.label}
                {f.required && " *"}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              ) : f.type === "select" ? (
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                >
                  <option value="">—</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  className="w-full border rounded px-3 py-2"
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <button
            onClick={() => create.mutate()}
            disabled={create.isPending}
            className="md:col-span-2 rounded-md bg-brand-gold px-4 py-2 text-sm font-medium text-brand-navy"
          >
            {create.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      )}
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground">No records yet.</p>
      ) : (
        <div className="rounded-lg border overflow-x-auto -mx-2 px-0 sm:mx-0">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-3 py-2 text-left">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id} className="border-t">
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2">
                      {c.render ? c.render(r) : (r[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
