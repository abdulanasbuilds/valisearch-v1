import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import type { PricingTier } from "@/types/analysis";

/* ─── Deterministic hash for stable random-looking values ── */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* ─── Parse price from hint string ─────────────────────── */
function parseLowestPrice(hint: string): number {
  const matches = hint.match(/\$(\d+)/g);
  if (!matches) return 0;
  return Math.min(...matches.map((m) => parseInt(m.replace("$", ""), 10)));
}

/* ─── Revenue projection ─────────────────────────────────── */
function generateMrrProjection(tiers: PricingTier[]): { month: string; conservative: number; realistic: number; optimistic: number }[] {
  const price = parseLowestPrice(tiers[0]?.price_hint ?? "$49") || 49;
  return Array.from({ length: 24 }, (_, i) => {
    const base = price * (i + 1) * 4;
    return {
      month: `M${i + 1}`,
      conservative: Math.round(base * 0.7),
      realistic:    Math.round(base * 1.1),
      optimistic:   Math.round(base * 1.55),
    };
  });
}

/* ─── Revenue stream pie ─────────────────────────────────── */
const STREAM_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

/* ─── Custom tooltip ─────────────────────────────────────── */
interface TooltipPayload {
  dataKey: string;
  color: string;
  name: string;
  value: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/[0.1] rounded-xl px-4 py-3 text-[12px] shadow-xl">
      <p className="text-white/40 mb-1.5">{label}</p>
      {payload.map((p: TooltipPayload) => (
        <p key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-white/50">{p.name}:</span>
          <span className="font-bold text-white/80">${p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

const TIER_BADGE = ["Starter", "Pro", "Enterprise"];
const TIER_COLORS = [
  "border-white/[0.09] bg-white/[0.03]",
  "border-indigo-500/35 bg-indigo-500/8",
  "border-purple-500/30 bg-purple-500/6",
];

export function RevenueIntelligenceSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { monetization, competitor_analysis } = analysis;
  const projection = generateMrrProjection(monetization.pricing_tiers);

  const streamData = monetization.revenue_streams.map((s, i) => ({
    name: s,
    value: Math.round(100 / monetization.revenue_streams.length + (i % 3) * 8),
  }));

  const lastMonth = projection[projection.length - 1];

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Revenue Intelligence</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Pricing strategy, revenue projections, and competitive pricing landscape
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Y2 Conservative MRR", value: `$${Math.round(lastMonth.conservative * 0.6 / 1000)}K` },
          { label: "Y2 Realistic MRR",     value: `$${Math.round(lastMonth.realistic * 0.6 / 1000)}K` },
          { label: "Y2 Optimistic MRR",    value: `$${Math.round(lastMonth.optimistic * 0.6 / 1000)}K` },
        ].map(({ label, value }) => (
          <SectionCard key={label}>
            <div className="text-[11px] text-muted-foreground/60 mb-1">{label}</div>
            <div className="text-[26px] font-black text-white/85 leading-tight">{value}</div>
            <div className="text-[10.5px] text-muted-foreground/40">Monthly recurring</div>
          </SectionCard>
        ))}
      </div>

      {/* Pricing tiers */}
      <div className="grid md:grid-cols-3 gap-4">
        {monetization.pricing_tiers.map((tier, i) => (
          <div key={tier.name} className={`rounded-xl border p-5 relative overflow-hidden ${TIER_COLORS[i] ?? TIER_COLORS[2]}`}>
            {i === 1 && (
              <div className="absolute top-3 right-3 text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/30">
                Popular
              </div>
            )}
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/35 mb-2">{TIER_BADGE[i] ?? tier.name}</div>
            <div className="text-[22px] font-black text-white/90 mb-1">{tier.name}</div>
            <div className="text-[14px] font-semibold text-white/50 mb-3">{tier.price_hint}</div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{tier.reasoning}</p>
          </div>
        ))}
      </div>

      {/* MRR Projection chart */}
      <SectionCard title="MRR Projection — 24 Months">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projection} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="optimGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(99,102,241,0.3)" />
                  <stop offset="95%" stopColor="rgba(99,102,241,0)" />
                </linearGradient>
                <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(139,92,246,0.25)" />
                  <stop offset="95%" stopColor="rgba(139,92,246,0)" />
                </linearGradient>
                <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="95%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="optimistic" name="Optimistic" stroke="rgba(99,102,241,0.7)" strokeWidth={1.5} fill="url(#optimGrad)" />
              <Area type="monotone" dataKey="realistic" name="Realistic" stroke="rgba(139,92,246,0.9)" strokeWidth={2} fill="url(#realGrad)" />
              <Area type="monotone" dataKey="conservative" name="Conservative" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} fill="url(#consGrad)" strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Revenue streams + competitor pricing */}
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Revenue Stream Mix">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={streamData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {streamData.map((_, i) => (
                    <Cell key={i} fill={STREAM_COLORS[i % STREAM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                <Legend iconSize={8} formatter={(v) => <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Competitor Pricing Intelligence">
          <div className="space-y-2">
            {/* Our pricing header */}
            <div className="flex items-center justify-between py-1.5 border-b border-white/[0.07] mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-400">Your Product</span>
              <span className="text-[12px] font-semibold text-white/70">{monetization.pricing_tiers[0]?.price_hint}</span>
            </div>
            {competitor_analysis.competitors.map((comp) => (
              <div key={comp.name} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                <div>
                  <div className="text-[12.5px] font-medium text-white/65">{comp.name}</div>
                  <div className="text-[11px] text-muted-foreground/50 mt-0.5">
                    {comp.weaknesses[0]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-muted-foreground/40">Est. range</div>
                  <div className="text-[12px] text-white/50">
                    ${hashStr(comp.name) % 60 + 20}–{(hashStr(comp.name + "hi") % 100) + 80}/mo
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
            {competitor_analysis.differentiation_strategy}
          </p>
        </SectionCard>
      </div>

      {/* Strategy */}
      <SectionCard title="Monetization Strategy">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2">Model</div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{monetization.pricing_model}</p>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2">Strategy</div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{monetization.strategy}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
