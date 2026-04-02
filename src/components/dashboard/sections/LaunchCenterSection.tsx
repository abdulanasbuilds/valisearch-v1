import { useState } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { BuildExportModal } from "../BuildExportModal";
import {
  Zap,
  Globe,
  CircleDot,
  ExternalLink,
  Sparkles,
  Download,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildExportPayload, downloadPayloadJSON } from "@/lib/data-serializer";

type BuilderType = "lovable" | "10web" | "bubble";

const BUILDERS = [
  {
    id: "lovable" as BuilderType,
    name: "Lovable",
    icon: Zap,
    color: "text-violet-400",
    border: "border-violet-500/20 hover:border-violet-500/40",
    glow: "hover:shadow-[0_0_30px_-8px_rgba(139,92,246,0.3)]",
    bg: "bg-violet-500/5",
    badge: "AI App Builder",
    primary: true,
    description:
      "Convert your validated features into a working full-stack React app — your entire blueprint is pre-loaded via deep link.",
  },
  {
    id: "10web" as BuilderType,
    name: "10Web",
    icon: Globe,
    color: "text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    glow: "hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.3)]",
    bg: "bg-emerald-500/5",
    badge: "Website Builder",
    primary: false,
    description:
      "Generate a professional landing page with your branding, features list, and go-to-market strategy.",
  },
  {
    id: "bubble" as BuilderType,
    name: "Bubble",
    icon: CircleDot,
    color: "text-sky-400",
    border: "border-sky-500/20 hover:border-sky-500/40",
    glow: "hover:shadow-[0_0_30px_-8px_rgba(14,165,233,0.3)]",
    bg: "bg-sky-500/5",
    badge: "No-Code Builder",
    primary: false,
    description:
      "Build a no-code application with your validated product specs, user flows, and monetization model.",
  },
];

export function LaunchCenterSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  const idea = useAnalysisStore((s) => s.idea);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeBuilder, setActiveBuilder] = useState<BuilderType>("lovable");

  if (!analysis) return null;

  const { branding, product_strategy, idea_analysis, scoring } = analysis;

  const openBuilder = (builder: BuilderType) => {
    setActiveBuilder(builder);
    setModalOpen(true);
  };

  const handleDownloadAll = () => {
    const payload = buildExportPayload(idea, analysis);
    downloadPayloadJSON(payload);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Launch Center</h2>
        </div>
        <p className="text-[13px] text-muted-foreground mt-1">
          Export your validated blueprint to external builders — zero data loss, full deep-link integration
        </p>
      </div>

      {/* Builder cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {BUILDERS.map((builder) => {
          const Icon = builder.icon;
          return (
            <div
              key={builder.id}
              className={`relative rounded-xl border p-5 transition-all duration-300 cursor-pointer group
                ${builder.border} ${builder.bg} ${builder.glow} backdrop-blur-md`}
              onClick={() => openBuilder(builder.id)}
            >
              {builder.primary && (
                <span className="absolute -top-2.5 right-3 text-[9px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full">
                  Recommended
                </span>
              )}

              <div className="flex items-center gap-2.5 mb-3">
                <div className={`p-2.5 rounded-lg bg-white/[0.06] ${builder.color} transition-transform group-hover:scale-110`}>
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
                variant={builder.primary ? "default" : "outline"}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Build with {builder.name}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Launch Brief */}
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
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">Validation Score</div>
            <p className="font-medium">
              <span className="text-primary">{scoring.weighted_final_score}/100</span>{" "}
              <span className="text-muted-foreground">— {scoring.verdict}</span>
            </p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">Features Count</div>
            <p className="font-medium">
              {product_strategy.mvp_features.length} MVP · {product_strategy.differentiation_features.length} Core · {product_strategy.premium_features.length} Advanced
            </p>
          </div>
          <div className="sm:col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">Concept</div>
            <p className="text-muted-foreground leading-relaxed">{idea_analysis.summary}</p>
          </div>
          <div className="sm:col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">MVP Features</div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {product_strategy.mvp_features.map((f) => (
                <span key={f} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07] text-foreground/60">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Download fallback */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <Button variant="ghost" size="sm" className="gap-2 text-[11px] text-muted-foreground" onClick={handleDownloadAll}>
            <Download className="h-3.5 w-3.5" />
            Download Full Blueprint (JSON)
          </Button>
        </div>
      </SectionCard>

      {/* Affiliate disclosure */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3 flex items-center gap-3">
        <Info className="h-4 w-4 text-muted-foreground/40 shrink-0" />
        <p className="text-[11px] text-muted-foreground/50">
          <span className="font-semibold text-muted-foreground/70">Affiliate Disclosure:</span>{" "}
          We may earn a commission when you sign up through our builder links. No personal data or emails are shared.
          Your privacy is always respected.
        </p>
      </div>

      {/* Export Modal */}
      <BuildExportModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        builder={activeBuilder}
      />
    </div>
  );
}
