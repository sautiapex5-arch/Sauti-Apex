import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ROLES = [
  "admin",
  "super_admin",
  "ceo",
  "consultant",
  "ops_manager",
  "project_manager",
  "hr_officer",
  "finance_officer",
  "team",
  "client",
];

export const Route = createFileRoute("/_authenticated/admin/users")({ component: UsersPage });

export function UsersPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ user_id: "", role: "team" });

  const { data: rows = [] } = useQuery({
    queryKey: ["user-roles-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*, profiles:user_id(display_name, contact_email)");
      if (error) throw error;
      return data ?? [];
    },
  });

  const grant = useMutation({
    mutationFn: async () => {
      if (!form.user_id) throw new Error("User ID required");
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: form.user_id, role: form.role as any });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role granted");
      setForm({ user_id: "", role: "team" });
      qc.invalidateQueries({ queryKey: ["user-roles-admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-roles-admin"] }),
  });

  return (
    <div>
      <h2 className="font-serif text-xl text-brand-navy mb-4">Users & Roles</h2>
      <div className="rounded-lg border bg-card p-4 mb-6 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[260px]">
          <label className="text-xs text-muted-foreground">User ID (uuid)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            placeholder="paste user uuid from auth"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Role</label>
          <select
            className="border rounded px-3 py-2"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => grant.mutate()}
          className="rounded-md bg-brand-navy text-white px-4 py-2 text-sm"
        >
          Grant role
        </button>
      </div>

      <div className="rounded-lg border overflow-x-auto -mx-2 px-0 sm:mx-0">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.profiles?.display_name || "—"}</td>
                <td className="px-3 py-2">{r.profiles?.contact_email || r.user_id.slice(0, 8)}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{r.role}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => revoke.mutate(r.id)} className="text-xs text-destructive">
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
