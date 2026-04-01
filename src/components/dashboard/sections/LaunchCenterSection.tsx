import { useState } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { Zap, Globe, Layout, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ─── Analytics helper ─────────────────────────────────────── */
function trackLaunch(tool: string) {
  try {
    const existing = JSON.parse(localStorage.getItem("vs_launch_analytics") || "[]");
    existing.push({ tool, timestamp: Date.now() });
    localStorage.setItem("vs_launch_analytics", JSON.stringify(existing));
  } catch { /* ignore */ }
}

/* ─── Card config ──────────────────────────────────────────── */
const BUILDERS = [
  {
    id: "lovable",
    name: "Lovable",
    icon: Zap,
    color: "text-violet-400",
    border: "border-violet-500/20 hover:border-violet-500/40",
    bg: "bg-violet-500/5",
    badge: "AI App Builder",
    description: "Convert your validated features into a working full-stack React app with one click.",
    action: "Launch on Lovable",
    actionType: "deeplink" as const,
  },
  {
    id: "10web",
    name: "10Web",
    icon: Globe,
    color: "text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    bg: "bg-emerald-500/5",
    badge: "Website Builder",
    description: "Generate a professional landing page and marketing website powered by AI.",
    action: "Copy Specs & Open",
    actionType: "clipboard" as const,
  },
  {
    id: "softr",
    name: "Softr",
    icon: Layout,
    color: "text-amber-400",
    border: "border-amber-500/20 hover:border-amber-500/40",
    bg: "bg-amber-500/5",
    badge: "Client Portal",
    description: "Build a no-code client portal or internal tool from your validated product specs.",
    action: "Copy Specs & Open",
    actionType: "clipboard" as const,
  },
];

export function LaunchCenterSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  const idea = useAnalysisStore((s) => s.idea);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!analysis) return null;

  const { branding, product_strategy, idea_analysis } = analysis;

  const buildLovableUrl = () => {
    const prompt = `Build a SaaS app: "${branding.name_suggestions[0]}"

${idea_analysis.summary}

Tagline: ${branding.taglines[0]}

MVP Features:
${product_strategy.mvp_features.map((f) => `- ${f}`).join("\n")}

Design: Dark premium UI, glassmorphism cards, Inter font, dashboard layout with sidebar.`;
    return `https://lovable.dev/projects/new?prompt=${encodeURIComponent(prompt)}`;
  };

  const buildClipboardText = (tool: string) => {
    const base = `Project: ${branding.name_suggestions[0]}
Tagline: ${branding.taglines[0]}
Brand Voice: ${branding.brand_positioning}

Description: ${idea_analysis.summary}

Features:
${product_strategy.mvp_features.map((f) => `• ${f}`).join("\n")}`;

    if (tool === "softr") {
      return `${base}\n\nPortal Pages:\n• Dashboard\n• User Management\n• Analytics\n• Settings`;
    }
    return base;
  };

  const handleAction = (builder: typeof BUILDERS[0]) => {
    trackLaunch(builder.id);

    if (builder.actionType === "deeplink") {
      window.open(buildLovableUrl(), "_blank");
      toast.success("Opening Lovable with your project specs!");
    } else {
      const text = buildClipboardText(builder.id);
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(builder.id);
        setTimeout(() => setCopiedId(null), 3000);
        toast.success(`Specs copied! Paste them into ${builder.name}.`);
      });

      const urls: Record<string, string> = {
        "10web": "https://10web.io",
        softr: "https://softr.io",
      };
      setTimeout(() => window.open(urls[builder.id] || "#", "_blank"), 600);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Launch Center</h2>
        </div>
        <p className="text-[13px] text-muted-foreground mt-1">
          Turn your validated idea into a real product — connect to external builders with one click
        </p>
      </div>

      {/* Builder cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {BUILDERS.map((builder) => {
          const Icon = builder.icon;
          const isCopied = copiedId === builder.id;

          return (
            <div
              key={builder.id}
              className={`rounded-xl border p-5 transition-all duration-300 ${builder.border} ${builder.bg} backdrop-blur-md`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`p-2 rounded-lg bg-white/[0.06] ${builder.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold">{builder.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium">
                    {builder.badge}
                  </span>
                </div>
              </div>

              <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-4">
                {builder.description}
              </p>

              <Button
                size="sm"
                className="w-full gap-2 h-9 text-[12px]"
                variant="outline"
                onClick={() => handleAction(builder)}
              >
                {builder.actionType === "deeplink" ? (
                  <ExternalLink className="h-3.5 w-3.5" />
                ) : isCopied ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {isCopied ? "Copied!" : builder.action}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Quick idea summary */}
      <SectionCard title="Your Launch Brief">
        <div className="grid sm:grid-cols-2 gap-4 text-[12.5px]">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">Name</div>
            <p className="font-medium">{branding.name_suggestions[0]}</p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">Tagline</div>
            <p className="italic text-foreground/70">"{branding.taglines[0]}"</p>
          </div>
          <div className="sm:col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">Concept</div>
            <p className="text-muted-foreground leading-relaxed">{idea_analysis.summary}</p>
          </div>
          <div className="sm:col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">MVP Features</div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {product_strategy.mvp_features.map((f) => (
                <span key={f} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07] text-white/60">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Referral badge */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3 flex items-center justify-between">
        <p className="text-[11.5px] text-muted-foreground/50">
          <span className="font-semibold text-muted-foreground/70">ValiSearch Partners</span>{" "}
          — Get 10% off your builder subscription using our referral links
        </p>
        <span className="text-[10px] text-primary font-medium shrink-0 ml-3">Coming Soon</span>
      </div>
    </div>
  );
}
