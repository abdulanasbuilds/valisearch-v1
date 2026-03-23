import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";

export function CompetitorsSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { competitor_analysis } = analysis;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Competitors</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Key players in the space and their positioning</p>
      </div>

      <SectionCard title="Summary">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{competitor_analysis.summary}</p>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2">
        {competitor_analysis.competitors.map((c) => (
          <SectionCard key={c.name}>
            <h4 className="text-[14px] font-semibold">{c.name}</h4>
            <div className="mt-3 space-y-2">
              <div>
                <span className="text-[11px] font-medium text-[hsl(var(--success))]">Strengths</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {c.strengths.map((s) => (
                    <span key={s} className="rounded-md bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/15 px-2 py-0.5 text-[11px] text-[hsl(var(--success))]">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[hsl(var(--destructive))]">Weaknesses</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {c.weaknesses.map((w) => (
                    <span key={w} className="rounded-md bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/15 px-2 py-0.5 text-[11px] text-[hsl(var(--destructive))]">{w}</span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Gap Opportunities">
        <ul className="space-y-2">
          {competitor_analysis.gap_opportunities.map((g) => (
            <li key={g} className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-[hsl(var(--success))] shrink-0" />
              {g}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Differentiation Strategy">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{competitor_analysis.differentiation_strategy}</p>
      </SectionCard>
    </div>
  );
}
