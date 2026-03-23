import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { ScoreDisplay } from "../ScoreDisplay";

export function OverviewSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { idea_analysis, final_verdict, scoring } = analysis;

  const verdictColor =
    final_verdict.verdict === "Strong"
      ? "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/20"
      : final_verdict.verdict === "Moderate"
        ? "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/20"
        : "text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/20";

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Overview</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Executive summary of your startup analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <SectionCard title="Idea Summary">
          <p className="text-[13px] leading-relaxed text-muted-foreground">{idea_analysis.summary}</p>
          <p className="mt-3 text-[12px] text-foreground/70 italic">"{idea_analysis.one_liner}"</p>
        </SectionCard>

        <SectionCard className="flex flex-col items-center justify-center min-w-[200px]">
          <ScoreDisplay score={scoring.weighted_final_score} maxScore={100} />
          <span className={`mt-3 inline-block rounded-md border px-3 py-1 text-[12px] font-semibold ${verdictColor}`}>
            {final_verdict.verdict}
          </span>
        </SectionCard>
      </div>

      {/* Scoring pillars */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(scoring.pillars).map(([key, pillar]) => (
          <SectionCard key={key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
              <span className="text-[13px] font-semibold tabular-nums">{pillar.score}/10</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pillar.score * 10}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground/70">{pillar.explanation}</p>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Final Verdict">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{final_verdict.quick_summary}</p>
        <p className="mt-2 text-[12px] text-muted-foreground/70">{scoring.verdict_rationale}</p>
      </SectionCard>
    </div>
  );
}
