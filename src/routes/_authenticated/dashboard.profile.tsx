import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signOut } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ display_name: "", contact_email: "", phone: "" });

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name ?? "",
        contact_email: profile.contact_email ?? user?.email ?? "",
        phone: profile.phone ?? "",
      });
    } else if (user) {
      setForm((f) => ({ ...f, contact_email: f.contact_email || user.email || "" }));
    }
  }, [profile, user]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user!.id,
          display_name: form.display_name,
          contact_email: form.contact_email,
          phone: form.phone,
        },
        { onConflict: "id" },
      );
      if (error) throw error;
    },

    onSuccess: () => {
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["my-profile", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Display name
        </label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          value={form.display_name}
          onChange={(e) => setForm({ ...form, display_name: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Contact email
        </label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          value={form.contact_email}
          onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Phone</label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="rounded-md bg-brand-navy text-white px-5 py-2 text-sm font-semibold"
        >
          {save.isPending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={signOut}
          className="rounded-md border border-border px-5 py-2 text-sm font-semibold"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
