import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";

export function ValidationSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { validation } = analysis;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Validation</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Market demand, feasibility, and risk assessment</p>
      </div>

      <SectionCard title="Market Demand">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{validation.market_demand}</p>
      </SectionCard>

      <SectionCard title="Feasibility">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{validation.feasibility}</p>
      </SectionCard>

      <SectionCard title="Identified Risks">
        <div className="flex flex-wrap gap-1.5">
          {validation.risks.map((r) => (
            <span key={r} className="inline-block rounded-md border border-[hsl(var(--destructive))]/20 bg-[hsl(var(--destructive))]/10 px-2.5 py-1 text-[11px] font-medium text-[hsl(var(--destructive))]">
              {r}
            </span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
