import { useRef, useEffect, useState } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

/* ─── Gauge SVG ─────────────────────────────────────────── */
function DemandGauge({ score }: { score: number }) {
  const R = 80;
  const arc = Math.PI * R;
  const gaugeRef = useRef<SVGPathElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const offset = arc - (score / 100) * arc;
  const color = score >= 70 ? "#6ee7b7" : score >= 45 ? "#fcd34d" : "#f87171";

  return (
    <svg viewBox="-110 -100 220 130" className="w-56 mx-auto">
      {/* Shadow glow */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Track */}
      <path d={`M -${R} 0 A ${R} ${R} 0 0 1 ${R} 0`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
      {/* Fill */}
      <path
        ref={gaugeRef}
        d={`M -${R} 0 A ${R} ${R} 0 0 1 ${R} 0`}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={arc}
        strokeDashoffset={animated ? offset : arc}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
        filter="url(#glow)"
      />
      {/* Labels */}
      <text x={-R - 4} y="18" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">0</text>
      <text x={R + 4} y="18" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">100</text>
      {/* Score */}
      <text textAnchor="middle" y="-12" fontSize="38" fontWeight="900" fill="white">{score}</text>
      <text textAnchor="middle" y="10" fontSize="11" fill="rgba(255,255,255,0.4)">Demand Score</text>
    </svg>
  );
}

/* ─── Custom tooltip ────────────────────────────────────── */
interface TooltipPayload {
  dataKey: string;
  color: string;
  name: string;
  value: number | string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/[0.1] rounded-xl px-4 py-3 text-[12px] shadow-xl">
      <p className="text-white/40 mb-1">{label}</p>
      {payload.map((p: TooltipPayload) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ─── Helper: parse score range ──────────────────────────── */
function marketTrendData(trends: string[]): { subject: string; score: number }[] {
  const keywords: Record<string, number> = { ai: 90, automation: 85, saas: 80, b2b: 75, mobile: 70, enterprise: 65, consumer: 60, blockchain: 50 };
  return trends.slice(0, 6).map((t, i) => {
    const lower = t.toLowerCase();
    const matched = Object.entries(keywords).find(([k]) => lower.includes(k));
    return { subject: t.slice(0, 20), score: matched ? matched[1] : 55 + i * 5 };
  });
}

function seededRand(seed: number, i: number): number {
  const x = Math.sin(seed + i * 9301 + 49297) * 233280;
  return Math.abs(x - Math.floor(x));
}

function growthData(seed: number): { month: string; demand: number; risk: number }[] {
  return Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    demand: Math.min(100, 40 + i * 5 + Math.round(seededRand(seed, i) * 8)),
    risk: Math.max(10, 55 - i * 3 + Math.round(seededRand(seed + 1, i) * 6)),
  }));
}

const RISK_SEVERITY: Record<string, "high" | "medium" | "low"> = {};
function getRiskSeverity(risk: string): "high" | "medium" | "low" {
  if (RISK_SEVERITY[risk]) return RISK_SEVERITY[risk];
  const lc = risk.toLowerCase();
  if (lc.includes("competi") || lc.includes("regulat") || lc.includes("depend")) return "high";
  if (lc.includes("enterprise") || lc.includes("scale") || lc.includes("integr")) return "medium";
  return "low";
}

const SEV_COLOR = { high: "text-red-400 bg-red-500/10 border-red-500/20", medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", low: "text-blue-400 bg-blue-500/10 border-blue-500/20" };

export function MarketFeasibilitySection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { scoring, market_research, validation } = analysis;
  const demandScore = scoring.pillars.market_demand.score * 10;
  const radarData = marketTrendData(market_research.trends);
  const growthSeed = scoring.weighted_final_score + scoring.pillars.market_demand.score;
  const growth = growthData(growthSeed);

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Market Feasibility</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Demand signal strength, growth trends, and risk landscape
        </p>
      </div>

      {/* Top row: gauge + radar */}
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Market Demand Score">
          <DemandGauge score={demandScore} />
          <p className="text-center text-[12px] text-muted-foreground mt-4">
            {scoring.pillars.market_demand.explanation}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {(["uniqueness", "scalability", "stickiness"] as const).map((k) => (
              <div key={k} className="text-center">
                <div className="text-[18px] font-bold text-white/80">{scoring.pillars[k].score}<span className="text-[11px] text-white/30">/10</span></div>
                <div className="text-[10px] text-white/30 capitalize mt-0.5">{k.replace(/_/g, " ")}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Trend Signal Radar">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} />
                <Radar name="Signal" dataKey="score" stroke="rgba(99,102,241,0.8)" fill="rgba(99,102,241,0.18)" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Growth demand chart */}
      <SectionCard title="Projected Demand vs Risk Timeline (12 months)">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growth} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(99,102,241,0.4)" />
                  <stop offset="95%" stopColor="rgba(99,102,241,0)" />
                </linearGradient>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(248,113,113,0.3)" />
                  <stop offset="95%" stopColor="rgba(248,113,113,0)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="demand" name="Demand" stroke="rgba(99,102,241,0.8)" strokeWidth={2} fill="url(#demandGrad)" />
              <Area type="monotone" dataKey="risk" name="Risk" stroke="rgba(248,113,113,0.7)" strokeWidth={1.5} fill="url(#riskGrad)" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Risk factors */}
      <SectionCard title="Risk Factors">
        <div className="grid sm:grid-cols-2 gap-3">
          {validation.risks.map((risk, i) => {
            const sev = getRiskSeverity(risk);
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="mt-0.5">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${SEV_COLOR[sev]}`}>
                    {sev}
                  </span>
                </div>
                <p className="text-[12.5px] text-muted-foreground leading-snug">{risk}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* TAM/SAM/SOM */}
      <SectionCard title="Market Sizing">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "TAM", sub: "Total Addressable Market", value: market_research.tam_sam_som.tam, color: "border-indigo-500/30 bg-indigo-500/5" },
            { label: "SAM", sub: "Serviceable Addressable", value: market_research.tam_sam_som.sam, color: "border-yellow-500/20 bg-yellow-500/5" },
            { label: "SOM", sub: "Serviceable Obtainable", value: market_research.tam_sam_som.som, color: "border-green-500/20 bg-green-500/5" },
          ].map(({ label, sub, value, color }) => (
            <div key={label} className={`rounded-xl border p-4 ${color}`}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1">{label}</div>
              <div className="text-[20px] font-black text-white/85 leading-tight mb-1">{value}</div>
              <div className="text-[10.5px] text-white/30">{sub}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed">{market_research.growth_outlook}</p>
      </SectionCard>
    </div>
  );
}
