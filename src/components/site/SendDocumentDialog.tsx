import { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  Send,
  X,
  Loader2,
  Search,
  ChevronRight,
  Users,
  User,
  Upload,
  Sparkles,
  Stamp,
  FileText,
  ArrowLeft,
  Check,
} from "lucide-react";
import { uploadProjectFile } from "@/lib/storage";
import { polishDocumentText, brandDocumentText } from "@/lib/document-polish.functions";

type Step = "project" | "audience" | "person" | "upload";
type Audience = "everyone" | "single";
type Treatment = "original" | "polished" | "branded";

const TEXTUAL = /\.(txt|md|markdown|html?|csv|json|xml)$/i;

export function SendDocumentDialog() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const polish = useServerFn(polishDocumentText);
  const brand = useServerFn(brandDocumentText);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("project");
  const [search, setSearch] = useState("");
  const [project, setProject] = useState<any>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [recipient, setRecipient] = useState<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [treatment, setTreatment] = useState<Treatment>("original");
  const [aiContent, setAiContent] = useState<string>("");
  const [aiBusy, setAiBusy] = useState<null | "polished" | "branded">(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep("project");
    setSearch("");
    setProject(null);
    setAudience(null);
    setRecipient(null);
    setFile(null);
    setTitle("");
    setTreatment("original");
    setAiContent("");
    setAiBusy(null);
  };
  const close = () => {
    if (sending) return;
    setOpen(false);
    reset();
  };

  const { data: projects = [] } = useQuery({
    queryKey: ["send-doc-projects"],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, project_no, project_name, client_id, clients(company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: participants = [], isLoading: loadingPeople } = useQuery({
    queryKey: ["send-doc-people", project?.id],
    enabled: !!project?.id && step === "person",
    queryFn: async () => {
      const [membersRes, clientUsersRes] = await Promise.all([
        supabase
          .from("project_members")
          .select("user_id, role_on_project")
          .eq("project_id", project.id),
        project.client_id
          ? supabase
              .from("client_users")
              .select("user_id, is_primary")
              .eq("client_id", project.client_id)
          : Promise.resolve({ data: [] as any[] }),
      ]);
      const map = new Map<string, { user_id: string; role: string }>();
      (membersRes.data ?? []).forEach((m: any) =>
        map.set(m.user_id, { user_id: m.user_id, role: m.role_on_project || "Team" }),
      );
      (clientUsersRes.data ?? []).forEach((c: any) =>
        map.set(c.user_id, {
          user_id: c.user_id,
          role: c.is_primary ? "Primary client" : "Client",
        }),
      );
      const ids = [...map.keys()];
      if (!ids.length) return [];
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, contact_email")
        .in("id", ids);
      const pm = new Map((profs ?? []).map((p: any) => [p.id, p]));
      return ids.map((id) => ({
        user_id: id,
        role: map.get(id)!.role,
        name: pm.get(id)?.display_name || pm.get(id)?.contact_email || "Member",
        email: pm.get(id)?.contact_email,
      }));
    },
  });

  const q = search.trim().toLowerCase();
  const filteredProjects = q
    ? (projects as any[]).filter(
        (p) =>
          (p.project_no ?? "").toLowerCase().includes(q) ||
          (p.project_name ?? "").toLowerCase().includes(q) ||
          (p.clients?.company_name ?? "").toLowerCase().includes(q),
      )
    : (projects as any[]);

  const isTextFile = useMemo(
    () => !!file && (TEXTUAL.test(file.name) || /text|json|markdown|html|xml|csv/i.test(file.type)),
    [file],
  );

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) {
      toast.error("File too large (max 20MB).");
      return;
    }
    setFile(f);
    setTitle((t) => t || f.name.replace(/\.[^.]+$/, ""));
    setTreatment("original");
    setAiContent("");
  };

  const runAi = async (mode: "polished" | "branded") => {
    if (!file) return;
    if (!isTextFile) {
      toast.error(
        "AI works on text files (TXT, MD, HTML, CSV, JSON). Upload text to polish or brand.",
      );
      return;
    }
    setAiBusy(mode);
    try {
      const text = await file.text();
      if (mode === "polished") {
        const out = await polish({ data: { text, title } });
        setAiContent(out.polished);
      } else {
        const out = await brand({ data: { text, title } });
        setAiContent(out.branded);
      }
      setTreatment(mode);
      toast.success(mode === "branded" ? "Rebranded on Sauti letterhead" : "Polished by Sauti AI");
    } catch (e: any) {
      toast.error(e.message ?? "AI failed");
    } finally {
      setAiBusy(null);
    }
  };

  const handleSend = async () => {
    if (!file || !project) return;
    setSending(true);
    try {
      // Build the file to upload based on chosen treatment.
      let uploadFile: File = file;
      let branded = false;
      let fileName = file.name;
      if (treatment !== "original" && aiContent) {
        const base = (title || file.name).replace(/\.[^.]+$/, "");
        fileName = `${base}-${treatment === "branded" ? "sauti-branded" : "polished"}.md`;
        uploadFile = new File([aiContent], fileName, { type: "text/markdown" });
        branded = treatment === "branded";
      }

      const path = await uploadProjectFile(project.id, uploadFile);
      const { data: docRow, error: docErr } = await (supabase as any)
        .from("documents")
        .insert({
          project_id: project.id,
          client_id: project.client_id ?? null,
          file_name: fileName,
          title: title || fileName,
          category: "Shared",
          file_url: path,
          mime_type: uploadFile.type || null,
          file_size: uploadFile.size,
          uploaded_by: user?.id,
          is_branded: branded,
        })
        .select("id")
        .single();
      if (docErr) throw docErr;

      // Post into the project conversation so it appears in the thread.
      const targetName = audience === "single" ? recipient?.name : "everyone on this project";
      await (supabase as any).from("project_messages").insert({
        project_id: project.id,
        sender_id: user?.id,
        body: `Shared a document with ${targetName}: ${title || fileName}`,
        document_id: docRow?.id,
      });

      // Notify the chosen recipients.
      const recipientIds: string[] =
        audience === "single"
          ? recipient?.user_id
            ? [recipient.user_id]
            : []
          : (participants as any[]).map((p) => p.user_id);

      const notifyIds = (recipientIds.length ? recipientIds : await everyoneIds(project)).filter(
        (id) => id && id !== user?.id,
      );
      if (notifyIds.length) {
        await (supabase as any).from("notifications").insert(
          notifyIds.map((uid) => ({
            user_id: uid,
            title: "New document shared",
            message: `${title || fileName} was shared with you on ${project.project_name}.`,
            link: `/projects/${project.id}`,
            notification_type: "info",
          })),
        );
      }

      qc.invalidateQueries({ queryKey: ["project-documents", project.id] });
      qc.invalidateQueries({ queryKey: ["project-messages", project.id] });
      qc.invalidateQueries({ queryKey: ["client-documents"] });
      toast.success("Document sent");
      close();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold-deep transition"
      >
        <Send size={16} /> Send a document
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={close}>
          <div
            className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-brand-navy px-5 py-3 text-brand-cream">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-brand-gold" />
                <span className="font-serif text-base">Send a document</span>
              </div>
              <button
                onClick={close}
                className="text-brand-cream/80 hover:text-brand-cream"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-border bg-muted/40 px-5 py-2 text-xs text-muted-foreground">
              <Crumb active={step === "project"} done={!!project}>
                1. Project
              </Crumb>
              <ChevronRight size={12} />
              <Crumb active={step === "audience"} done={!!audience}>
                2. Audience
              </Crumb>
              {audience === "single" && (
                <>
                  <ChevronRight size={12} />
                  <Crumb active={step === "person"} done={!!recipient}>
                    3. Person
                  </Crumb>
                </>
              )}
              <ChevronRight size={12} />
              <Crumb active={step === "upload"} done={false}>
                {audience === "single" ? "4" : "3"}. Document
              </Crumb>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {/* STEP 1: choose project */}
              {step === "project" && (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Choose the project this document belongs to.
                  </p>
                  <div className="relative mb-3">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by project no, name or client…"
                      className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    {filteredProjects.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No projects found.</p>
                    ) : (
                      filteredProjects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setProject(p);
                            setStep("audience");
                          }}
                          className="flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-left hover:border-brand-gold/60"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-brand-navy">{p.project_name}</span>
                              {p.project_no && (
                                <span className="rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-semibold text-brand-cream">
                                  {p.project_no}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {p.clients?.company_name ?? "—"}
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: audience */}
              {step === "audience" && project && (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Send to everyone on{" "}
                    <span className="font-medium text-brand-navy">{project.project_name}</span>, or
                    a single person?
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => {
                        setAudience("everyone");
                        setRecipient(null);
                        setStep("upload");
                      }}
                      className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-brand-gold/60"
                    >
                      <Users size={22} className="text-brand-gold-deep" />
                      <span className="font-medium text-brand-navy">Everyone on the project</span>
                      <span className="text-xs text-muted-foreground">
                        All clients & team members involved get it.
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setAudience("single");
                        setStep("person");
                      }}
                      className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-brand-gold/60"
                    >
                      <User size={22} className="text-brand-gold-deep" />
                      <span className="font-medium text-brand-navy">A single person</span>
                      <span className="text-xs text-muted-foreground">
                        Pick one person involved in the project.
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: person */}
              {step === "person" && (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Choose who should receive this document.
                  </p>
                  {loadingPeople ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="animate-spin" size={16} /> Loading people…
                    </div>
                  ) : participants.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No people are linked to this project yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {(participants as any[]).map((p) => (
                        <button
                          key={p.user_id}
                          onClick={() => {
                            setRecipient(p);
                            setStep("upload");
                          }}
                          className="flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-left hover:border-brand-gold/60"
                        >
                          <div>
                            <div className="font-medium text-brand-navy">{p.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {p.role}
                              {p.email ? ` · ${p.email}` : ""}
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: upload + AI */}
              {step === "upload" && (
                <div className="space-y-4">
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    Sending to{" "}
                    <span className="font-medium text-brand-navy">
                      {audience === "single"
                        ? recipient?.name
                        : `everyone on ${project?.project_name}`}
                    </span>
                  </div>

                  <input ref={fileRef} type="file" className="hidden" onChange={onPickFile} />
                  {!file ? (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border bg-card px-4 py-10 text-muted-foreground hover:border-brand-gold/60"
                    >
                      <Upload size={26} />
                      <span className="text-sm font-medium">Click to choose a document</span>
                      <span className="text-xs">Max 20MB</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3">
                      <FileText size={18} className="text-brand-gold-deep" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-brand-navy">
                          {file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setFile(null);
                          setAiContent("");
                          setTreatment("original");
                        }}
                        className="text-muted-foreground hover:text-brand-navy"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {file && (
                    <>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Document title
                        </label>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <div className="mb-2 text-xs font-medium text-muted-foreground">
                          Polish or brand with Sauti AI (optional)
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <TreatmentBtn
                            active={treatment === "original"}
                            onClick={() => setTreatment("original")}
                            icon={<FileText size={15} />}
                            label="Send original"
                          />
                          <TreatmentBtn
                            active={treatment === "polished"}
                            busy={aiBusy === "polished"}
                            onClick={() =>
                              aiContent && treatment !== "polished"
                                ? runAi("polished")
                                : runAi("polished")
                            }
                            icon={<Sparkles size={15} />}
                            label="AI polish"
                          />
                          <TreatmentBtn
                            active={treatment === "branded"}
                            busy={aiBusy === "branded"}
                            onClick={() => runAi("branded")}
                            icon={<Stamp size={15} />}
                            label="Brand Sauti style"
                          />
                        </div>
                        {!isTextFile && (
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            AI polish/branding works on text files (TXT, MD, HTML, CSV, JSON). Other
                            files will be sent as-is.
                          </p>
                        )}
                        {treatment !== "original" && aiContent && (
                          <div className="mt-3 max-h-48 overflow-auto rounded-md border border-border bg-muted/30 p-3">
                            <div className="mb-1 text-[10px] uppercase tracking-wider text-brand-gold-deep">
                              {treatment === "branded" ? "Branded preview" : "Polished preview"}
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-xs text-foreground/80">
                              {aiContent}
                            </pre>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border bg-card px-5 py-3">
              <button
                onClick={() => {
                  if (step === "audience") setStep("project");
                  else if (step === "person") setStep("audience");
                  else if (step === "upload")
                    setStep(audience === "single" ? "person" : "audience");
                  else close();
                }}
                disabled={sending}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm disabled:opacity-50"
              >
                <ArrowLeft size={14} /> {step === "project" ? "Cancel" : "Back"}
              </button>

              {step === "upload" && (
                <button
                  onClick={handleSend}
                  disabled={sending || !file || (audience === "single" && !recipient)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold-deep disabled:opacity-50"
                >
                  {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}{" "}
                  Send document
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  async function everyoneIds(p: any): Promise<string[]> {
    const [m, c] = await Promise.all([
      supabase.from("project_members").select("user_id").eq("project_id", p.id),
      p.client_id
        ? supabase.from("client_users").select("user_id").eq("client_id", p.client_id)
        : Promise.resolve({ data: [] as any[] }),
    ]);
    return [
      ...new Set([
        ...(m.data ?? []).map((x: any) => x.user_id),
        ...(c.data ?? []).map((x: any) => x.user_id),
      ]),
    ];
  }
}

function Crumb({
  active,
  done,
  children,
}: {
  active: boolean;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
        active
          ? "bg-brand-navy text-brand-cream"
          : done
            ? "text-brand-gold-deep"
            : "text-muted-foreground"
      }`}
    >
      {done && !active && <Check size={11} />}
      {children}
    </span>
  );
}

function TreatmentBtn({
  active,
  busy,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  busy?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition disabled:opacity-60 ${
        active
          ? "border-brand-gold bg-brand-gold/15 text-brand-gold-deep"
          : "border-border bg-card text-brand-navy hover:border-brand-gold/50"
      }`}
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}
