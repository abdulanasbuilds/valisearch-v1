import { mockAnalysisResult } from "@/data/mockData";
import { SectionCard } from "../SectionCard";

export function ValidationSection() {
  const { validation } = mockAnalysisResult;

  const severityStyle = {
    high: "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))] border-[hsl(var(--destructive))]/20",
    medium: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20",
    low: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20",
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Validation</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Market demand, feasibility, and risk assessment</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Market Demand", value: validation.marketDemand },
          { label: "Feasibility", value: validation.feasibility },
          { label: "Innovation Score", value: validation.innovationScore },
        ].map((m) => (
          <SectionCard key={m.label}>
            <div className="text-center">
              <div className="text-2xl font-bold tabular-nums">{m.value}%</div>
              <div className="text-[12px] text-muted-foreground mt-1">{m.label}</div>
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Identified Risks">
        <div className="flex flex-wrap gap-1.5">
          {validation.risks.map((r) => (
            <span key={r.label} className={`inline-block rounded-md border px-2.5 py-1 text-[11px] font-medium ${severityStyle[r.severity]}`}>
              {r.label}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Key Strengths">
        <ul className="space-y-2">
          {validation.strengths.map((s) => (
            <li key={s} className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-[hsl(var(--success))] shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
