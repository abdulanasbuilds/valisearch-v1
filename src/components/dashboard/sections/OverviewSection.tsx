import { useEffect, useRef } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { ScoreDisplay } from "../ScoreDisplay";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { PillarKey } from "@/types/analysis";

const PILLAR_LABELS: Record<PillarKey, string> = {
  uniqueness:              "Uniqueness",
  market_demand:           "Market Demand",
  stickiness:              "Stickiness",
  monetization_potential:  "Monetization",
  scalability:             "Scalability",
  execution_complexity:    "Exec Complexity",
};

const PILLAR_NOTES: Record<PillarKey, string> = {
  uniqueness:              "Higher = more differentiated",
  market_demand:           "Higher = larger proven demand",
  stickiness:              "Higher = stronger retention",
  monetization_potential:  "Higher = more revenue levers",
  scalability:             "Higher = scales more easily",
  execution_complexity:    "Higher = harder to build (caution)",
};

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
  { label: "Competitors", path: "competitors" },
  { label: "Market sizing", path: "market" },
  { label: "Pricing tiers", path: "monetization" },
  { label: "Sprint board", path: "kanban" },
  { label: "Tech stack", path: "tech-stack" },
  { label: "Build mode", path: "build-mode" },
];

export function OverviewSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
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
        {(Object.entries(scoring.pillars) as [PillarKey, { score: number; explanation: string }][]).map(
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

      <SectionCard title="Final Verdict">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{final_verdict.quick_summary}</p>
      </SectionCard>
    </div>
  );
}
