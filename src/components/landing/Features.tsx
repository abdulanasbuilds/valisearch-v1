import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── VISUAL 1: Animated Score Gauge (72/100) + 6 Dimension Bars ─── */
function ScoreVisual() {
  const dims = [
    { l: "Uniqueness", v: 78, color: "from-blue-500 to-blue-400" },
    { l: "Market Demand", v: 84, color: "from-emerald-500 to-emerald-400" },
    { l: "Stickiness", v: 65, color: "from-amber-500 to-amber-400" },
    { l: "Monetization", v: 71, color: "from-purple-500 to-purple-400" },
    { l: "Scalability", v: 80, color: "from-cyan-500 to-cyan-400" },
    { l: "Complexity", v: 58, color: "from-rose-500 to-rose-400" },
  ];
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - (72 / 100) * c;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-12 mb-4 sm:mb-8">
        {/* Circular Score Gauge */}
        <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] flex-shrink-0 group">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 relative z-10">
            <circle cx="80" cy="80" r={r} stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="none" />
            <circle
              cx="80"
              cy="80"
              r={r}
              stroke="url(#featureScoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              className="transition-all duration-[2000ms] ease-out"
            />
            <defs>
              <linearGradient id="featureScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="text-[52px] font-black text-white leading-none tabular-nums tracking-tighter">72</div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-2">/ 100</div>
          </div>
        </div>

        {/* 6 Dimension Bars */}
        <div className="flex-1 space-y-3.5 w-full">
          {dims.map((d) => (
            <div key={d.l} className="group/item">
              <div className="flex justify-between text-[11px] mb-1.5 font-bold uppercase tracking-[0.15em]">
                <span className="text-zinc-500 group-hover/item:text-zinc-300 transition-colors">{d.l}</span>
                <span className="text-white/40 font-mono tabular-nums">{d.v}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden border border-white/[0.02]">
                <div
                  className={`h-full bg-gradient-to-r ${d.color} rounded-full transition-all duration-[1500ms] ease-out`}
                  style={{ width: `${d.v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── VISUAL 2: Market Size — TAM/SAM/SOM Nested Rectangles ─── */
function MarketVisual() {
  return (
    <div className="w-full flex items-center justify-center py-8 sm:py-12">
      <div className="relative w-full max-w-[360px] aspect-square">
        <div className="absolute -inset-10 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />
        {/* TAM — Outermost */}
        <div className="absolute inset-0 rounded-[40px] border border-white/[0.05] bg-white/[0.01] flex items-start justify-start p-6 sm:p-8 group hover:bg-white/[0.03] transition-all duration-500 shadow-2xl">
          <div>
            <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-1.5">TAM</div>
            <div className="text-[32px] sm:text-[36px] font-black text-white tracking-tighter leading-none group-hover:scale-105 transition-transform origin-left">$24.8B</div>
            <div className="text-[10px] text-zinc-600 mt-1 font-medium">Total Addressable Market</div>
          </div>
        </div>
        {/* SAM — Middle */}
        <div className="absolute inset-[15%] rounded-[32px] border border-blue-500/20 bg-blue-500/[0.04] flex items-start justify-start p-6 sm:p-8 backdrop-blur-md shadow-2xl group hover:bg-blue-500/[0.06] transition-all">
          <div>
            <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-blue-400/60 mb-1.5">SAM</div>
            <div className="text-[28px] sm:text-[32px] font-black text-white tracking-tighter leading-none">$6.2B</div>
            <div className="text-[10px] text-blue-400/40 mt-1 font-medium">Serviceable Market</div>
          </div>
        </div>
        {/* SOM — Innermost */}
        <div className="absolute inset-[32%] rounded-[24px] border border-purple-500/30 bg-purple-500/[0.08] flex items-center justify-center backdrop-blur-xl shadow-[0_0_60px_rgba(139,92,246,0.15)] group hover:scale-[1.02] transition-all">
          <div className="text-center">
            <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-purple-400/80 mb-1.5">SOM</div>
            <div className="text-[24px] sm:text-[28px] font-black text-white tracking-tighter leading-none">$420M</div>
            <div className="text-[10px] text-purple-400/50 mt-1 font-medium">Target Share</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── VISUAL 3: Kanban Board — 3 Columns with Task Cards ─── */
function KanbanVisual() {
  const cols = [
    {
      t: "Backlog",
      dot: "bg-zinc-500",
      items: [
        { name: "User Auth Flow", tag: "Feature", tagColor: "text-blue-400 bg-blue-500/10" },
        { name: "Payment Integration", tag: "Backend", tagColor: "text-purple-400 bg-purple-500/10" },
      ],
    },
    {
      t: "In Progress",
      dot: "bg-amber-500",
      items: [
        { name: "Landing Page V2", tag: "Design", tagColor: "text-emerald-400 bg-emerald-500/10" },
        { name: "API Rate Limiting", tag: "Backend", tagColor: "text-purple-400 bg-purple-500/10" },
      ],
    },
    {
      t: "Done",
      dot: "bg-emerald-500",
      items: [
        { name: "Market Analysis", tag: "Research", tagColor: "text-amber-400 bg-amber-500/10" },
        { name: "Competitor Audit", tag: "Strategy", tagColor: "text-cyan-400 bg-cyan-500/10" },
      ],
    },
  ];

  return (
    <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
      {cols.map((col) => (
        <div key={col.t} className="rounded-xl sm:rounded-2xl bg-white/[0.01] border border-white/[0.04] p-2.5 sm:p-4 shadow-inner">
          <div className="flex items-center gap-2 mb-3 sm:mb-5">
            <div className={`w-2 h-2 rounded-full ${col.dot}`} />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-600 truncate">
              {col.t}
            </span>
            <span className="ml-auto w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center text-[8px] sm:text-[9px] font-black text-zinc-500 flex-shrink-0">
              {col.items.length}
            </span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {col.items.map((it) => (
              <div
                key={it.name}
                className="rounded-lg sm:rounded-xl bg-[#121214] border border-white/[0.06] p-2.5 sm:p-3.5 shadow-lg hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="text-[10px] sm:text-[12px] font-bold text-zinc-400 group-hover:text-white transition-colors mb-2">
                  {it.name}
                </div>
                <span className={`inline-block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${it.tagColor}`}>
                  {it.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Feature Block Layout (55/45 split, alternating) ─── */
function FeatureBlock({
  label,
  headline,
  body,
  visual,
  reverse = false,
}: {
  label: string;
  headline: string;
  body: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="relative py-20 sm:py-28 lg:py-40 overflow-hidden group">
      <div className="section-container grid lg:grid-cols-[55fr_45fr] gap-12 sm:gap-16 lg:gap-24 items-center">
        {/* Text Column */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${reverse ? "lg:order-2" : ""} relative z-10`}
        >
          <div className="inline-flex items-center gap-3 px-3 sm:px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] mb-6 sm:mb-10 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-zinc-600">
              {label}
            </span>
          </div>
          <h2 className="text-[32px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-black text-white leading-[1.05] mb-6 sm:mb-10 tracking-tighter">
            {headline}
          </h2>
          <p className="text-base sm:text-lg lg:text-[19px] text-zinc-500 leading-relaxed max-w-[540px] mb-8 sm:mb-12 font-medium">
            {body}
          </p>
          <a
            href="#idea-input"
            className="group/link flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:text-blue-400 transition-all cursor-pointer"
          >
            Experience the Engine
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/link:border-blue-500 group-hover/link:bg-blue-500 transition-all duration-500">
              <ArrowRight className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
            </div>
          </a>
        </motion.div>

        {/* Visual Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`${reverse ? "lg:order-1" : ""} relative`}
        >
          <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000" />
          <div className="rounded-2xl sm:rounded-[40px] border border-white/[0.06] bg-[#0C0C0E]/60 p-1.5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <div className="rounded-xl sm:rounded-[36px] border border-white/[0.03] bg-[#0A0A0A] p-5 sm:p-8 lg:p-12 overflow-hidden shadow-inner">
              {visual}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Glow Divider between blocks ─── */
function GlowDivider() {
  return (
    <div className="relative h-px w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-64 w-[1200px] h-128 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ─── Main Features Section ─── */
export function Features() {
  return (
    <section id="features" className="bg-[#0A0A0A] relative z-10">
      {/* BLOCK 1 — Text LEFT, Visual RIGHT */}
      <FeatureBlock
        label="Validation Engine"
        headline="AI that thinks like a serial founder"
        body="ValiSearch scores your idea across 6 dimensions — uniqueness, market demand, stickiness, monetization potential, scalability, and technical complexity. Get a 0-100 confidence score with specific reasoning for every dimension."
        visual={<ScoreVisual />}
      />
      <GlowDivider />

      {/* BLOCK 2 — Visual LEFT, Text RIGHT */}
      <FeatureBlock
        reverse
        label="Market Intelligence"
        headline="Know your market before you spend a dollar"
        body="Real TAM, SAM, and SOM estimates with sourced reasoning. Google Trends integration shows whether your market is growing or shrinking. Competitor landscape maps show exactly where gaps exist."
        visual={<MarketVisual />}
      />
      <GlowDivider />

      {/* BLOCK 3 — Text LEFT, Visual RIGHT */}
      <FeatureBlock
        label="Sprint Planner"
        headline="Validation to build-ready in one session"
        body="The only validation platform with a built-in Kanban sprint board. Your validated features become actionable development tasks — drag, prioritize, and export to Linear, Jira, or Notion."
        visual={<KanbanVisual />}
      />
    </section>
  );
}
