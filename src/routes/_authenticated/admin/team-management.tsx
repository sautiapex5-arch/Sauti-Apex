import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload, Crown, Sparkles } from "lucide-react";
import { polishTeamBio } from "@/lib/team-ai.functions";

export const Route = createFileRoute("/_authenticated/admin/team-management")({
  component: TeamManagementPage,
});

const blank = {
  full_name: "",
  title: "",
  bio: "",
  email: "",
  linkedin_url: "",
  photo_url: "",
  is_ceo: false,
  is_active: true,
  order_index: 0,
};

function TeamManagementPage() {
  const qc = useQueryClient();
  const polishBio = useServerFn(polishTeamBio);
  const [editing, setEditing] = useState<null | (typeof blank & { id?: string })>(null);
  const [polishing, setPolishing] = useState(false);

  const { data: members = [] } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("order_index");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (m: typeof blank & { id?: string }) => {
      if (!m.full_name.trim()) throw new Error("Name required");
      const payload = { ...m };
      if (m.id) {
        const { id, ...rest } = payload;
        const { error } = await supabase
          .from("team_members")
          .update(rest)
          .eq("id", id as string);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-team"] });
      qc.invalidateQueries({ queryKey: ["public-team"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-team"] });
      qc.invalidateQueries({ queryKey: ["public-team"] });
    },
  });

  const uploadPhoto = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("team-photos").upload(path, file);
    if (error) {
      toast.error(error.message);
      return null;
    }
    const { data } = supabase.storage.from("team-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const onPolishBio = async () => {
    if (!editing?.bio?.trim()) return toast.error("Add a draft bio first.");
    setPolishing(true);
    try {
      const out = await polishBio({
        data: { full_name: editing.full_name, title: editing.title, bio: editing.bio },
      });
      setEditing({ ...editing, bio: out.bio });
      toast.success("Bio polished with AI");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not polish bio.");
    } finally {
      setPolishing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-brand-navy">Team Members</h2>
        <button
          onClick={() => setEditing({ ...blank })}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm text-white"
        >
          + Add member
        </button>
      </div>

      {editing && (
        <div className="mb-6 rounded-lg border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Full name *"
            value={editing.full_name}
            onChange={(e) => setEditing({ ...editing, full_name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Title (e.g. CEO, Senior Consultant)"
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={editing.email}
            onChange={(e) => setEditing({ ...editing, email: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="LinkedIn URL"
            value={editing.linkedin_url}
            onChange={(e) => setEditing({ ...editing, linkedin_url: e.target.value })}
          />
          <div className="md:col-span-2">
            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={4}
              placeholder="Short bio"
              value={editing.bio}
              onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
            />
            <button
              type="button"
              onClick={onPolishBio}
              disabled={polishing}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-brand-navy/20 bg-brand-navy px-3 py-1.5 text-xs font-semibold text-brand-gold hover:bg-brand-navy-deep disabled:opacity-60"
            >
              <Sparkles size={14} /> {polishing ? "Polishing…" : "Polish bio with AI"}
            </button>
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            {editing.photo_url && (
              <img src={editing.photo_url} alt="" className="w-16 h-16 rounded object-cover" />
            )}
            <label className="inline-flex items-center gap-2 rounded border border-dashed px-3 py-2 cursor-pointer text-sm">
              <Upload size={14} /> Upload photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await uploadPhoto(f);
                  if (url) setEditing({ ...editing, photo_url: url });
                }}
              />
            </label>
            <input
              type="number"
              className="border rounded px-3 py-2 w-24"
              placeholder="Order"
              value={editing.order_index}
              onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
            />
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.is_ceo}
                onChange={(e) => setEditing({ ...editing, is_ceo: e.target.checked })}
              />{" "}
              CEO
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.is_active}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              />{" "}
              Active
            </label>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              onClick={() => save.mutate(editing)}
              disabled={save.isPending}
              className="rounded-md bg-brand-gold px-4 py-2 text-sm font-medium text-brand-navy"
            >
              {save.isPending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div key={m.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="aspect-[4/3] bg-muted">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                  {m.full_name[0]}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                {m.is_ceo && <Crown size={14} className="text-brand-gold-deep" />}
                <h3 className="font-semibold">{m.full_name}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{m.title}</p>
              {!m.is_active && (
                <span className="mt-1 inline-block text-xs bg-muted px-2 py-0.5 rounded">
                  Hidden
                </span>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() =>
                    setEditing({
                      ...blank,
                      ...m,
                      title: m.title ?? "",
                      bio: m.bio ?? "",
                      email: m.email ?? "",
                      linkedin_url: m.linkedin_url ?? "",
                      photo_url: m.photo_url ?? "",
                    })
                  }
                  className="text-xs px-2 py-1 border rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete?")) del.mutate(m.id);
                  }}
                  className="text-xs px-2 py-1 border rounded text-destructive"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
