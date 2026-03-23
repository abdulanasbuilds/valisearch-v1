import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";

export function MonetizationSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { monetization } = analysis;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Monetization</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Pricing strategy and revenue streams</p>
      </div>

      <SectionCard>
        <div className="text-[12px] text-muted-foreground mb-1">Pricing Model</div>
        <div className="text-[15px] font-semibold">{monetization.pricing_model}</div>
        <p className="mt-2 text-[13px] text-muted-foreground">{monetization.strategy}</p>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-3">
        {monetization.pricing_tiers.map((t, i) => (
          <SectionCard key={t.name} className={i === 1 ? "border-primary/30 ring-1 ring-primary/10" : ""}>
            {i === 1 && <span className="text-[10px] font-medium text-primary uppercase tracking-wider">Popular</span>}
            <h4 className="text-[14px] font-semibold mt-1">{t.name}</h4>
            <div className="text-xl font-bold mt-1">{t.price_hint}</div>
            <p className="mt-2 text-[12px] text-muted-foreground">{t.reasoning}</p>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Revenue Streams">
        <ul className="space-y-2">
          {monetization.revenue_streams.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-[hsl(var(--success))] shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
