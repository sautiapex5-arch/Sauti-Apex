import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Download, Sparkles, Loader2, X, Stamp } from "lucide-react";
import { toast } from "sonner";
import { polishDocumentText, brandDocumentText } from "@/lib/document-polish.functions";
import { resolveDocumentUrl } from "@/lib/storage";

type Doc = {
  id: string;
  file_name?: string | null;
  title?: string | null;
  category?: string | null;
  file_url?: string | null;
  uploaded_at?: string | null;
  created_at?: string | null;
  mime_type?: string | null;
  is_branded?: boolean | null;
};

export function DocumentCard({ doc, canPolish = false }: { doc: Doc; canPolish?: boolean }) {
  const name = doc.title ?? doc.file_name ?? "Document";
  const when = doc.uploaded_at ?? doc.created_at;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = await resolveDocumentUrl(doc.file_url);
    if (!url) return toast.error("No file available for this document.");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = doc.file_name ?? `${name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="group rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-brand-gold/50 transition flex items-center gap-3">
      <div className="grid place-items-center h-11 w-11 shrink-0 rounded-lg bg-brand-navy text-brand-gold">
        <FileText size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-brand-navy truncate flex items-center gap-2">
          {name}
          {doc.is_branded && (
            <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-semibold text-brand-gold-deep">
              Sauti branded
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {doc.category ?? "Document"}
          {when && <> · {new Date(when).toLocaleDateString()}</>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {canPolish && <AiDocButton doc={doc} mode="brand" />}
        {canPolish && <AiDocButton doc={doc} mode="polish" />}
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-gold-deep transition"
        >
          <Download size={14} /> Download
        </button>
      </div>
    </div>
  );
}

function AiDocButton({ doc, mode }: { doc: Doc; mode: "polish" | "brand" }) {
  const polish = useServerFn(polishDocumentText);
  const brand = useServerFn(brandDocumentText);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [source, setSource] = useState("");

  const isBrand = mode === "brand";
  const label = isBrand ? "Brand" : "AI Polish";
  const heading = isBrand ? "Sauti AI · Branded Document" : "Sauti AI · Polished Document";

  const run = async () => {
    const fileUrl = await resolveDocumentUrl(doc.file_url);
    if (!fileUrl) return toast.error("No file to process.");
    setLoading(true);
    setOutput("");
    setOpen(true);
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error(`Could not load file (HTTP ${res.status})`);
      const contentType = res.headers.get("content-type") ?? doc.mime_type ?? "";
      if (
        !/text|json|markdown|html|xml|csv/i.test(contentType) &&
        !/\.(txt|md|markdown|html?|csv|json|xml)$/i.test(doc.file_name ?? "")
      ) {
        throw new Error(
          "AI currently supports text-based documents (TXT, MD, HTML, CSV, JSON). For PDFs/DOCX, paste the text into a text document and re-upload.",
        );
      }
      const text = await res.text();
      setSource(text);
      if (isBrand) {
        const out = await brand({ data: { text, title: doc.title ?? doc.file_name ?? "" } });
        setOutput(out.branded);
      } else {
        const out = await polish({ data: { text, title: doc.title ?? doc.file_name ?? "" } });
        setOutput(out.polished);
      }
      toast.success(isBrand ? "Rebranded on Sauti letterhead" : "Polished by Sauti AI");
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    const u = URL.createObjectURL(blob);
    a.href = u;
    const base = (doc.title ?? doc.file_name ?? "document").replace(/\.[^.]+$/, "");
    a.download = `${base}-${isBrand ? "sauti-branded" : "polished"}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(u);
  };

  return (
    <>
      <button
        onClick={run}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
          isBrand
            ? "border border-brand-gold/40 bg-brand-gold/10 text-brand-gold-deep hover:bg-brand-gold/20"
            : "border border-brand-navy/20 bg-brand-navy text-brand-gold hover:bg-brand-navy-deep"
        }`}
        title={isBrand ? "Rebrand on Sauti letterhead with AI" : "Polish with Sauti AI"}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isBrand ? (
          <Stamp size={14} />
        ) : (
          <Sparkles size={14} />
        )}
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl bg-background border border-border shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-brand-navy text-brand-cream px-5 py-3">
              <div className="flex items-center gap-2">
                {isBrand ? (
                  <Stamp size={16} className="text-brand-gold" />
                ) : (
                  <Sparkles size={16} className="text-brand-gold" />
                )}
                <span className="font-serif text-base">{heading}</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-brand-cream/80 hover:text-brand-cream"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-0 overflow-hidden flex-1 min-h-0">
              <div className="p-4 overflow-auto border-r border-border bg-muted/30">
                <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  Original
                </div>
                <pre className="whitespace-pre-wrap text-xs text-foreground/80 font-sans">
                  {source}
                </pre>
              </div>
              <div className="p-4 overflow-auto">
                <div className="text-[10px] tracking-[0.2em] uppercase text-brand-gold-deep mb-2">
                  {isBrand ? "Branded" : "Polished"}
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin" size={16} /> Working…
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-brand-navy font-sans leading-relaxed">
                    {output}
                  </pre>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3 bg-card">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Close
              </button>
              <button
                onClick={downloadOutput}
                disabled={!output}
                className="inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold-deep disabled:opacity-50"
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
