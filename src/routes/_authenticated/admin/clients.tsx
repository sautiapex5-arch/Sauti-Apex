import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const qc = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    industry: "",
  });

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const createMut = useMutation({
    mutationFn: async () => {
      if (!form.company_name.trim()) throw new Error("Company name is required");
      const { error } = await supabase.from("clients").insert({
        company_name: form.company_name,
        contact_person: form.contact_person || null,
        email: form.email || null,
        phone: form.phone || null,
        industry: form.industry || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Client created");
      setShowNew(false);
      setForm({ company_name: "", contact_person: "", email: "", phone: "", industry: "" });
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-brand-navy">Clients</h2>
        <button
          onClick={() => setShowNew(!showNew)}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm text-white"
        >
          {showNew ? "Cancel" : "+ New Client"}
        </button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Company name *"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Contact person"
            value={form.contact_person}
            onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="Industry"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
          />
          <button
            onClick={() => createMut.mutate()}
            disabled={createMut.isPending}
            className="md:col-span-2 rounded-md bg-brand-gold px-4 py-2 text-sm font-medium text-brand-navy"
          >
            {createMut.isPending ? "Creating…" : "Create client"}
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : clients.length === 0 ? (
        <p className="text-muted-foreground">No clients yet. Create your first one above.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Industry</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{c.company_name}</td>
                  <td className="px-4 py-2">{c.contact_person || "—"}</td>
                  <td className="px-4 py-2">{c.industry || "—"}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
