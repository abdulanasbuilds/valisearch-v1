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
  type ExportPayload,
} from "@/lib/data-serializer";

type BuilderType = "lovable" | "10web" | "bubble";
type Step = "consent" | "serializing" | "compressing" | "ready" | "error";

const BUILDER_META: Record<
  BuilderType,
  { name: string; icon: typeof Zap; color: string; bgGlow: string }
> = {
  lovable: {
    name: "Lovable",
    icon: Zap,
    color: "text-violet-400",
    bgGlow: "shadow-violet-500/20",
  },
  "10web": {
    name: "10Web",
    icon: Globe,
    color: "text-emerald-400",
    bgGlow: "shadow-emerald-500/20",
  },
  bubble: {
    name: "Bubble",
    icon: CircleDot,
    color: "text-sky-400",
    bgGlow: "shadow-sky-500/20",
  },
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

  const meta = BUILDER_META[builder];
  const Icon = meta.icon;

  const resetState = useCallback(() => {
    setStep("consent");
    setConsent(false);
    setPayload(null);
    setLink("");
  }, []);

  const handleClose = (v: boolean) => {
    if (!v) resetState();
    onOpenChange(v);
  };

  /* ── Analytics ──────────────────────────────────────────── */
  const trackClick = (tool: string) => {
    try {
      const data = JSON.parse(localStorage.getItem("vs_launch_analytics") || "[]");
      data.push({ tool, timestamp: Date.now(), event: "export_build" });
      localStorage.setItem("vs_launch_analytics", JSON.stringify(data));
    } catch { /* noop */ }
  };

  /* ── Export flow ────────────────────────────────────────── */
  const startExport = async () => {
    if (!analysis) return;
    trackClick(builder);

    // Step 1: Serialize
    setStep("serializing");
    await sleep(600);
    const exportData = buildExportPayload(idea, analysis);
    setPayload(exportData);

    // Step 2: Compress & generate link
    setStep("compressing");
    await sleep(500);

    let deepLink = "";
    if (builder === "lovable") {
      deepLink = buildLovableDeepLink(exportData);
    } else if (builder === "10web") {
      deepLink = build10WebDeepLink();
      // Also copy specs for 10web
      await navigator.clipboard.writeText(buildClipboardSpecs(exportData));
    } else {
      deepLink = buildBubbleDeepLink();
      await navigator.clipboard.writeText(buildClipboardSpecs(exportData));
    }

    setLink(deepLink);
    setStep("ready");
  };

  const openLink = () => {
    window.open(link, "_blank", "noopener");
    toast.success(`Opening ${meta.name} with your blueprint!`);
  };

  const downloadFallback = () => {
    if (payload) {
      downloadPayloadJSON(payload);
      toast.success("Blueprint JSON downloaded.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/[0.08] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg bg-white/[0.06] ${meta.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            Export to {meta.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[13px]">
            Your full ValiSearch blueprint will be packaged and sent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* ── Consent step ──────────────────────── */}
          {step === "consent" && (
            <>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                  This will export your <span className="text-foreground font-medium">complete analysis</span> —
                  including idea, features, flows, tech stack, branding, and scores — to {meta.name}.
                </p>
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="consent" className="text-[12px] text-muted-foreground leading-relaxed cursor-pointer">
                    I consent to share my idea data with {meta.name} via deep link.
                    <span className="block text-[11px] text-muted-foreground/50 mt-0.5">
                      We earn a commission on signups (affiliate). No email is shared.
                    </span>
                  </label>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                disabled={!consent}
                onClick={startExport}
              >
                <ExternalLink className="h-4 w-4" />
                Prepare Blueprint
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
                    ? "Serializing your blueprint…"
                    : "Compressing & generating link…"}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Ensuring zero data loss
                </p>
              </div>

              {/* Progress indicator */}
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
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
                <div className="text-center">
                  <p className="text-[14px] font-semibold">Blueprint Ready!</p>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    {builder === "lovable"
                      ? "Your full blueprint is pre-loaded. Sign up to edit!"
                      : "Specs copied to clipboard. Paste into the builder."}
                  </p>
                </div>
              </div>

              <Button className="w-full gap-2" onClick={openLink}>
                <ExternalLink className="h-4 w-4" />
                Open {meta.name}
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2 text-[12px]"
                onClick={downloadFallback}
              >
                <Download className="h-3.5 w-3.5" />
                Download JSON Backup
              </Button>

              <p className="text-[10px] text-center text-muted-foreground/40">
                Data persists after you sign up on {meta.name}.
              </p>
            </div>
          )}

          {/* ── Error ─────────────────────────────── */}
          {step === "error" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <p className="text-[13px] text-muted-foreground">
                Something went wrong. Try again or download the JSON.
              </p>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1" onClick={() => setStep("consent")}>
                  Retry
                </Button>
                <Button variant="outline" className="flex-1" onClick={downloadFallback}>
                  Download JSON
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
