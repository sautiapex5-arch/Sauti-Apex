import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { DocumentCard } from "./DocumentCard";
import { uploadProjectFile } from "@/lib/storage";

type Props = { projectId: string; clientId?: string | null };

export function ProjectThread({ projectId, clientId }: Props) {
  const { user, isTeam } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: messages = [] } = useQuery({
    queryKey: ["project-messages", projectId],
    queryFn: async () => {
      const { data: msgs, error } = await supabase
        .from("project_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const rows = msgs ?? [];
      const docIds = [
        ...new Set(rows.filter((m) => m.document_id).map((m) => m.document_id as string)),
      ];
      const senderIds = [...new Set(rows.map((m) => m.sender_id))];
      const [docsRes, profRes] = await Promise.all([
        docIds.length
          ? supabase.from("documents").select("*").in("id", docIds)
          : Promise.resolve({ data: [] as any[] }),
        senderIds.length
          ? supabase.from("profiles").select("id, display_name").in("id", senderIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);
      const docMap = new Map((docsRes.data ?? []).map((d: any) => [d.id, d]));
      const profMap = new Map((profRes.data ?? []).map((p: any) => [p.id, p.display_name]));
      return rows.map((m) => ({
        ...m,
        document: m.document_id ? (docMap.get(m.document_id) ?? null) : null,
        senderName: profMap.get(m.sender_id) ?? null,
      }));
    },
    refetchInterval: 15000,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["project-documents", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("project_id", projectId)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ text, documentId }: { text?: string; documentId?: string }) => {
      const { error } = await (supabase as any).from("project_messages").insert({
        project_id: projectId,
        sender_id: user?.id,
        body: text || null,
        document_id: documentId || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["project-messages", projectId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large (max 20MB).");
      return;
    }
    setUploading(true);
    try {
      const path = await uploadProjectFile(projectId, file);
      const { data: docRow, error } = await (supabase as any)
        .from("documents")
        .insert({
          project_id: projectId,
          client_id: clientId ?? null,
          file_name: file.name,
          title: file.name,
          category: "Shared",
          file_url: path,
          mime_type: file.type || null,
          file_size: file.size,
          uploaded_by: user?.id,
        })
        .select("id")
        .single();
      if (error) throw error;
      await sendMessage.mutateAsync({
        text: `Shared a document: ${file.name}`,
        documentId: docRow?.id,
      });
      qc.invalidateQueries({ queryKey: ["project-documents", projectId] });
      toast.success("Document sent");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Conversation */}
      <div className="rounded-lg border border-border bg-card flex flex-col min-h-[360px]">
        <div className="border-b border-border px-4 py-3 font-serif text-brand-navy">
          Conversation
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-[420px]">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No messages yet. Start the conversation below.
            </p>
          )}
          {messages.map((m: any) => {
            const mine = m.sender_id === user?.id;
            const who = mine ? "You" : m.senderName || "SautiApex Team";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    mine ? "bg-brand-navy text-brand-cream" : "bg-secondary text-foreground"
                  }`}
                >
                  <div
                    className={`mb-0.5 text-[10px] uppercase tracking-wider ${mine ? "text-brand-cream/60" : "text-muted-foreground"}`}
                  >
                    {who} · {new Date(m.created_at).toLocaleString()}
                  </div>
                  {m.body && <div className="whitespace-pre-wrap">{m.body}</div>}
                  {m.document && (
                    <div className="mt-2">
                      <DocumentCard doc={m.document} canPolish={isTeam} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={2}
              placeholder="Write a message…"
              className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input ref={fileRef} type="file" className="hidden" onChange={onPickFile} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="Attach a document"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border text-brand-navy hover:bg-secondary disabled:opacity-50"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
            </button>
            <button
              onClick={() => body.trim() && sendMessage.mutate({ text: body.trim() })}
              disabled={sendMessage.isPending || !body.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-gold text-brand-navy hover:bg-brand-gold-deep disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Project documents */}
      <div className="rounded-lg border border-border bg-card flex flex-col min-h-[360px]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-serif text-brand-navy">Project documents</span>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-navy px-3 py-1.5 text-xs font-semibold text-brand-cream hover:bg-brand-navy-deep disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />}{" "}
            Upload
          </button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-[460px]">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents on this project yet.</p>
          ) : (
            documents.map((d: any) => <DocumentCard key={d.id} doc={d} canPolish={isTeam} />)
          )}
        </div>
      </div>
    </div>
  );
}
