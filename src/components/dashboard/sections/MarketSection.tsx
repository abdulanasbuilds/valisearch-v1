import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";

export function MarketSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { market_research } = analysis;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Market Research</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Market sizing, growth outlook, and key trends</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "TAM", value: market_research.tam_sam_som.tam },
          { label: "SAM", value: market_research.tam_sam_som.sam },
          { label: "SOM", value: market_research.tam_sam_som.som },
        ].map((m) => (
          <SectionCard key={m.label}>
            <div className="text-[11px] font-mono font-medium text-primary/70 tracking-wide">{m.label}</div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Growth Outlook">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{market_research.growth_outlook}</p>
      </SectionCard>

      <SectionCard title="Key Trends">
        <ul className="space-y-2">
          {market_research.trends.map((t) => (
            <li key={t} className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
