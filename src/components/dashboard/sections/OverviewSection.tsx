import { useEffect, useRef } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { ScoreDisplay } from "../ScoreDisplay";
import { useNavigate } from "react-router-dom";
import { ArrowRight, AlertTriangle, Lightbulb, Zap, Crosshair } from "lucide-react";
import type { ValiSearchAnalysisV2 } from "@/types/analysis-v2";
import type { ValiSearchAnalysis } from "@/types/analysis";

function AnimatedBar({ score, delay }: { score: number; delay: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.width = `${score * 10}%`;
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        ref={barRef}
        className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
        style={{ width: "0%" }}
      />
    </div>
  );
}

const QUICK_LINKS = [
  { label: "Competitors", path: "competitive-intel" },
  { label: "Market sizing", path: "market-intelligence" },
  { label: "Offer pricing", path: "offer-builder" },
  { label: "Growth Playbook", path: "growth-playbook" },
  { label: "Problem Landscape", path: "problem-landscape" },
  { label: "Content Hooks", path: "content-engine" },
];

export function OverviewSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  const navigate = useNavigate();
  if (!analysis) return null;

  // Render V1 overview if this is a legacy analysis
  if ("scoring" in analysis) {
    return <LegacyOverviewSection />;
  }

  // Cast to V2
  const v2 = analysis as ValiSearchAnalysisV2;

  const topProblem = v2.problem_prioritization?.problems?.[0];
  const topGap = v2.competitor_weakness?.gap_analysis?.[0];
  const topOpp = v2.market_breakdown?.underserved_opportunities?.[0];
  const topLeverage = v2.distribution_plan?.leverage_plays?.[0];
  
  const biggestRisk = v2.scale_system?.biggest_risk;
  const topCompetitorStrength = v2.competitor_weakness?.competitors?.[0]?.defensible_strength;

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Executive Overview</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Startup intelligence briefing
          </p>
        </div>
      </div>

      {/* Top row: 4 metric cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SectionCard className="flex flex-col items-center justify-center py-4">
          <ScoreDisplay score={v2.overall_score || 0} maxScore={100} />
          <div className="mt-2 text-[11px] text-muted-foreground/50 text-center uppercase tracking-wider font-bold">Overall Score</div>
        </SectionCard>
        
        <SectionCard className="flex flex-col items-center justify-center py-4">
          <span className="text-3xl font-bold text-foreground">{v2.market_breakdown?.tam?.value || "?"}</span>
          <div className="mt-2 text-[11px] text-muted-foreground/50 text-center uppercase tracking-wider font-bold">Total Market</div>
        </SectionCard>
        
        <SectionCard className="flex flex-col items-center justify-center py-4">
          <span className="text-3xl font-bold text-foreground">
            {topProblem ? topProblem.combined_score : "?"}
            <span className="text-sm text-muted-foreground font-normal">/20</span>
          </span>
          <div className="mt-2 text-[11px] text-muted-foreground/50 text-center uppercase tracking-wider font-bold">Top Problem Score</div>
        </SectionCard>
        
        <SectionCard className="flex flex-col items-center justify-center py-4">
          <span className="text-3xl font-bold text-foreground">
             {v2.scale_system?.timeframe || "12m"}
          </span>
          <div className="mt-2 text-[11px] text-muted-foreground/50 text-center uppercase tracking-wider font-bold">To {v2.scale_system?.target_revenue || "$10K"}</div>
        </SectionCard>
      </div>

      {/* Quick Wins */}
      <SectionCard title="Your biggest opportunities right now">
        <div className="grid gap-3 sm:grid-cols-3 mt-2">
          {topGap && (
            <div className="p-3 rounded-lg bg-green-500/[0.04] border border-green-500/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Crosshair className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400/80">Market Gap</span>
              </div>
              <p className="text-[12.5px] font-medium text-foreground">{topGap.white_space}</p>
            </div>
          )}
          {topOpp && (
            <div className="p-3 rounded-lg bg-blue-500/[0.04] border border-blue-500/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">Underserved Need</span>
              </div>
              <p className="text-[12.5px] font-medium text-foreground">{topOpp.gap}</p>
            </div>
          )}
          {topLeverage && (
            <div className="p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">Growth Lever</span>
              </div>
              <p className="text-[12.5px] font-medium text-foreground">{topLeverage.tactic}</p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Biggest Risks */}
      <SectionCard title="Key Risks & Threats">
        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          {biggestRisk && (
            <div className="p-3 rounded-lg bg-red-500/[0.04] border border-red-500/10 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400/80">Execution Risk</span>
                <p className="text-[12px] text-foreground mt-1">{biggestRisk}</p>
              </div>
            </div>
          )}
          {topCompetitorStrength && (
            <div className="p-3 rounded-lg bg-orange-500/[0.04] border border-orange-500/10 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400/80">Competitor Moat</span>
                <p className="text-[12px] text-foreground mt-1">{topCompetitorStrength}</p>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Quick nav */}
      <SectionCard title="Explore Report">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QUICK_LINKS.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(`/dashboard/${path}`)}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all text-left"
            >
              <span className="text-[12.5px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

const PILLAR_LABELS: Record<string, string> = {
  uniqueness:              "Uniqueness",
  market_demand:           "Market Demand",
  stickiness:              "Stickiness",
  monetization_potential:  "Monetization",
  scalability:             "Scalability",
  execution_complexity:    "Exec Complexity",
};

const PILLAR_NOTES: Record<string, string> = {
  uniqueness:              "Higher = more differentiated",
  market_demand:           "Higher = larger proven demand",
  stickiness:              "Higher = stronger retention",
  monetization_potential:  "Higher = more revenue levers",
  scalability:             "Higher = scales more easily",
  execution_complexity:    "Higher = harder to build (caution)",
};

const LEGACY_QUICK_LINKS = [
  { label: "Competitors", path: "competitors" },
  { label: "Market sizing", path: "market" },
  { label: "Pricing tiers", path: "monetization" },
  { label: "Sprint board", path: "kanban" },
  { label: "Tech stack", path: "tech-stack" },
  { label: "Build mode", path: "build-mode" },
];

function LegacyOverviewSection() {
  const analysis = useAnalysisStore((s) => s.analysis) as ValiSearchAnalysis;
  const navigate = useNavigate();
  if (!analysis) return null;

  const { idea_analysis, final_verdict, scoring } = analysis;

  const verdictColor =
    final_verdict.verdict === "Strong"
      ? "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/25"
      : final_verdict.verdict === "Moderate"
        ? "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/25"
        : "text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/25";

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Overview</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Executive summary of your startup analysis
          </p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold ${verdictColor}`}>
          {final_verdict.verdict}
        </span>
      </div>

      {/* Score + summary */}
      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <SectionCard className="flex flex-col items-center justify-center px-8 min-w-[180px]">
          <ScoreDisplay score={scoring.weighted_final_score} maxScore={100} />
          <div className="mt-2 text-[11px] text-muted-foreground/50 text-center">weighted score</div>
        </SectionCard>
        <SectionCard title="Idea Summary">
          <p className="text-[13px] leading-relaxed text-muted-foreground">{idea_analysis.summary}</p>
          <p className="mt-3 text-[12px] text-foreground/60 italic border-l-2 border-white/[0.08] pl-3">
            "{idea_analysis.one_liner}"
          </p>
          <p className="mt-3 text-[12px] text-muted-foreground/60">{scoring.verdict_rationale}</p>
        </SectionCard>
      </div>

      {/* Pillar scores */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(scoring.pillars).map(
          ([key, pillar], i) => (
            <SectionCard key={key}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[12px] font-medium text-muted-foreground/80">
                  {PILLAR_LABELS[key]}
                </span>
                <span className="text-[14px] font-bold tabular-nums">{pillar.score}<span className="text-[10px] text-muted-foreground/40">/10</span></span>
              </div>
              <AnimatedBar score={pillar.score} delay={i * 80} />
              <p className="mt-2 text-[11px] text-muted-foreground/55 leading-snug">{pillar.explanation}</p>
              <p className="mt-1 text-[10px] text-muted-foreground/30 italic">{PILLAR_NOTES[key]}</p>
            </SectionCard>
          )
        )}
      </div>

      {/* Quick nav */}
      <SectionCard title="Explore Report">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LEGACY_QUICK_LINKS.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(`/dashboard/${path}`)}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all text-left"
            >
              <span className="text-[12.5px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Final Verdict">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{final_verdict.quick_summary}</p>
      </SectionCard>
    </div>
  );
}
