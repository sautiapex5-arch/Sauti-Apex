import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/notifications")({
  component: NotificationsPage,
});

export function NotificationsPage() {
  const qc = useQueryClient();
  const { data: notifs = [] } = useQuery({
    queryKey: ["notifications-admin"],
    queryFn: async () =>
      (
        await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100)
      ).data ?? [],
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_status: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications-admin"] }),
  });

  return (
    <div>
      <h2 className="font-serif text-xl text-brand-navy mb-4">Notifications</h2>
      <div className="space-y-2">
        {notifs.length === 0 && <p className="text-muted-foreground">No notifications.</p>}
        {notifs.map((n: any) => (
          <div
            key={n.id}
            className={`rounded-lg border p-3 flex items-start justify-between ${n.read_status ? "opacity-60" : "bg-brand-gold/5"}`}
          >
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-muted-foreground">{n.message}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(n.created_at).toLocaleString()}
              </div>
            </div>
            {!n.read_status && (
              <button
                onClick={() => markRead.mutate(n.id)}
                className="text-xs border px-2 py-1 rounded"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
