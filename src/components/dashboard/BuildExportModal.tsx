import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  CheckCircle2,
  ExternalLink,
  Download,
  AlertTriangle,
  Zap,
  Globe,
  CircleDot,
  Copy,
  FileText,
  FileJson,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import {
  buildExportPayload,
  buildLovableDeepLink,
  build10WebDeepLink,
  buildBubbleDeepLink,
  buildClipboardSpecs,
  downloadPayloadJSON,
  downloadPayloadTXT,
  trackExportEvent,
  type ExportPayload,
} from "@/lib/data-serializer";

type BuilderType = "lovable" | "10web" | "bubble";
type Step = "consent" | "serializing" | "compressing" | "ready" | "error";

const BUILDER_META: Record<
  BuilderType,
  { name: string; icon: typeof Zap; color: string }
> = {
  lovable: { name: "Lovable", icon: Zap, color: "text-violet-400" },
  "10web": { name: "10Web", icon: Globe, color: "text-emerald-400" },
  bubble: { name: "Bubble", icon: CircleDot, color: "text-sky-400" },
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  builder: BuilderType;
}

export function BuildExportModal({ open, onOpenChange, builder }: Props) {
  const analysis = useAnalysisStore((s) => s.analysis);
  const idea = useAnalysisStore((s) => s.idea);
  const [step, setStep] = useState<Step>("consent");
  const [consent, setConsent] = useState(false);
  const [payload, setPayload] = useState<ExportPayload | null>(null);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const meta = BUILDER_META[builder];
  const Icon = meta.icon;

  const resetState = useCallback(() => {
    setStep("consent");
    setConsent(false);
    setPayload(null);
    setLink("");
    setCopied(false);
  }, []);

  const handleClose = (v: boolean) => {
    if (!v) resetState();
    onOpenChange(v);
  };

  /* ── Export flow (clipboard-first) ─────────────────────── */
  const startExport = async () => {
    if (!analysis) return;
    trackExportEvent(builder, "click");

    try {
      // Step 1: Serialize
      setStep("serializing");
      await sleep(500);
      const exportData = buildExportPayload(idea, analysis);
      setPayload(exportData);

      // Step 2: Copy to clipboard (PRIMARY method)
      setStep("compressing");
      await sleep(400);

      const promptText = buildClipboardSpecs(exportData);
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      trackExportEvent(builder, "copy");

      // Generate deep link (secondary/optional)
      let deepLink = "";
      if (builder === "lovable") {
        deepLink = buildLovableDeepLink(exportData);
      } else if (builder === "10web") {
        deepLink = build10WebDeepLink();
      } else {
        deepLink = buildBubbleDeepLink();
      }

      setLink(deepLink);
      setStep("ready");
    } catch {
      setStep("error");
    }
  };

  const handleCopyAgain = async () => {
    if (!payload) return;
    const text = buildClipboardSpecs(payload);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackExportEvent(builder, "copy");
    toast.success("Blueprint prompt copied to clipboard!");
  };

  const openLink = () => {
    trackExportEvent(builder, "open_link");
    window.open(link, "_blank", "noopener");
    toast.success(`Opening ${meta.name} — paste your prompt after signup!`);
  };

  const handleDownloadJSON = () => {
    if (payload) {
      downloadPayloadJSON(payload);
      trackExportEvent(builder, "download_json");
      toast.success("Blueprint JSON downloaded.");
    }
  };

  const handleDownloadTXT = () => {
    if (payload) {
      downloadPayloadTXT(payload);
      trackExportEvent(builder, "download_txt");
      toast.success("Blueprint prompt TXT downloaded.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/[0.08] max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg bg-white/[0.06] ${meta.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            Export to {meta.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[13px]">
            Your full blueprint will be copied to clipboard and ready to paste.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* ── Consent step ──────────────────────── */}
          {step === "consent" && (
            <>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                  This will export your <span className="text-foreground font-medium">complete analysis</span> —
                  including idea, features, flows, tech stack, branding, and scores.
                </p>
                <div className="rounded-md bg-white/[0.03] border border-white/[0.05] p-3">
                  <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                    <strong className="text-foreground/80">How it works:</strong> Your blueprint prompt is copied to clipboard →
                    {meta.name} opens in a new tab → Paste the prompt to start building.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="consent" className="text-[12px] text-muted-foreground leading-relaxed cursor-pointer">
                    I consent to export my idea data to {meta.name}.
                    <span className="block text-[11px] text-muted-foreground/50 mt-0.5">
                      Affiliate link used. No emails or personal data shared.
                    </span>
                  </label>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                disabled={!consent}
                onClick={startExport}
              >
                <Copy className="h-4 w-4" />
                Copy Blueprint & Prepare
              </Button>
            </>
          )}

          {/* ── Progress steps ────────────────────── */}
          {(step === "serializing" || step === "compressing") && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className={`h-8 w-8 animate-spin ${meta.color}`} />
              <div className="text-center">
                <p className="text-[14px] font-medium">
                  {step === "serializing"
                    ? "Generating master prompt…"
                    : "Copying to clipboard…"}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Zero data loss — every field included
                </p>
              </div>

              <div className="flex gap-2">
                <div className={`h-1.5 w-12 rounded-full ${step === "serializing" ? "bg-primary animate-pulse" : "bg-primary"}`} />
                <div className={`h-1.5 w-12 rounded-full ${step === "compressing" ? "bg-primary animate-pulse" : "bg-white/[0.08]"}`} />
                <div className="h-1.5 w-12 rounded-full bg-white/[0.08]" />
              </div>
            </div>
          )}

          {/* ── Ready ─────────────────────────────── */}
          {step === "ready" && (
            <div className="space-y-4">
              {/* Success banner */}
              <div className="flex flex-col items-center gap-3 py-4">
                <ClipboardCheck className="h-10 w-10 text-green-400" />
                <div className="text-center">
                  <p className="text-[14px] font-semibold">Prompt Copied Successfully!</p>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    Open {meta.name}, then <span className="text-foreground font-medium">paste</span> the blueprint prompt.
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
                <p className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider">Next Steps:</p>
                <ol className="text-[12px] text-muted-foreground space-y-1.5 list-decimal list-inside">
                  <li>Click <strong>"Open {meta.name}"</strong> below</li>
                  <li>Sign up or log in to {meta.name}</li>
                  <li><strong>Paste</strong> (Ctrl+V / ⌘+V) the prompt into the builder</li>
                  <li>Your complete app blueprint will be loaded!</li>
                </ol>
              </div>

              {/* Primary: Open builder */}
              <Button className="w-full gap-2" onClick={openLink}>
                <ExternalLink className="h-4 w-4" />
                Open {meta.name}
              </Button>

              {/* Copy again */}
              <Button
                variant="outline"
                className="w-full gap-2 text-[12px]"
                onClick={handleCopyAgain}
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied Again ✓" : "Re-copy Prompt"}
              </Button>

              {/* Backup downloads */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-[11px] text-muted-foreground"
                  onClick={handleDownloadTXT}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Download TXT
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-[11px] text-muted-foreground"
                  onClick={handleDownloadJSON}
                >
                  <FileJson className="h-3.5 w-3.5" />
                  Download JSON
                </Button>
              </div>

              <p className="text-[10px] text-center text-muted-foreground/40">
                Data persists after you sign up on {meta.name}. Keep the downloaded files as backup.
              </p>
            </div>
          )}

          {/* ── Error ─────────────────────────────── */}
          {step === "error" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <p className="text-[13px] text-muted-foreground text-center">
                Clipboard copy failed. Download the files instead.
              </p>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1 gap-1.5 text-[12px]" onClick={() => setStep("consent")}>
                  Retry
                </Button>
                <Button variant="outline" className="flex-1 gap-1.5 text-[12px]" onClick={handleDownloadTXT}>
                  <FileText className="h-3.5 w-3.5" />
                  Get TXT
                </Button>
                <Button variant="outline" className="flex-1 gap-1.5 text-[12px]" onClick={handleDownloadJSON}>
                  <FileJson className="h-3.5 w-3.5" />
                  Get JSON
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
