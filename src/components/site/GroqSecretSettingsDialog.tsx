import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound, Loader2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGroqAiSettings, saveGroqAiSettings } from "@/lib/groq-settings.functions";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export function GroqSecretSettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const getSettings = useServerFn(getGroqAiSettings);
  const saveSettings = useServerFn(saveGroqAiSettings);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_MODEL);

  const settings = useQuery({
    queryKey: ["groq-ai-settings"],
    queryFn: () => getSettings(),
    enabled: open,
  });

  useEffect(() => {
    if (settings.data?.model) setModel(settings.data.model);
  }, [settings.data?.model]);

  const save = useMutation({
    mutationFn: () => saveSettings({ data: { apiKey, model } }),
    onSuccess: (next) => {
      setApiKey("");
      setModel(next.model);
      queryClient.setQueryData(["groq-ai-settings"], next);
      toast.success("Groq AI settings saved");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not save Groq AI settings.");
    },
  });

  const configured = settings.data?.configured ?? false;
  const source = settings.data?.source ?? "missing";
  const status = configured
    ? source === "environment"
      ? "Configured from environment"
      : "Configured from secret menu"
    : "Not configured";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-brand-navy">
            <Sparkles size={18} className="text-brand-gold-deep" />
            Groq AI Settings
          </DialogTitle>
          <DialogDescription>
            Store the Groq API key used by Sauti AI. The saved key is kept on the server and is
            never shown again.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
            {settings.isLoading ? (
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                Checking Groq configuration
              </span>
            ) : (
              <span className={configured ? "text-brand-navy" : "text-destructive"}>{status}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="groq-api-key" className="flex items-center gap-2">
              <KeyRound size={14} />
              Groq API key
            </Label>
            <Input
              id="groq-api-key"
              type="password"
              autoComplete="off"
              placeholder={configured ? "Leave blank to keep existing key" : "gsk_..."}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="groq-model">Groq model</Label>
            <Input
              id="groq-model"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              placeholder={DEFAULT_MODEL}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
