import { mockAnalysisResult } from "@/data/mockData";
import { SectionCard } from "../SectionCard";

export function MarketSection() {
  const { market_research } = mockAnalysisResult;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Market Research</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Market sizing, growth outlook, and key trends</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "TAM", value: market_research.tam, desc: market_research.tamDescription },
          { label: "SAM", value: market_research.sam, desc: market_research.samDescription },
          { label: "SOM", value: market_research.som, desc: market_research.somDescription },
        ].map((m) => (
          <SectionCard key={m.label}>
            <div className="text-[11px] font-mono font-medium text-primary/70 tracking-wide">{m.label}</div>
            <div className="text-xl font-bold mt-1">{m.value}</div>
            <div className="text-[12px] text-muted-foreground mt-1">{m.desc}</div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Growth Outlook">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg font-bold text-[hsl(var(--success))]">{market_research.growthRate}</span>
          <span className="text-[12px] text-muted-foreground">CAGR through 2030</span>
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{market_research.growthOutlook}</p>
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
