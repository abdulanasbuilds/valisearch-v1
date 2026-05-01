import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

function ScoreVisual() {
  const dims = [
    { l: "Uniqueness", v: 78 },
    { l: "Market demand", v: 84 },
    { l: "Stickiness", v: 65 },
    { l: "Monetization", v: 71 },
    { l: "Scalability", v: 80 },
    { l: "Complexity", v: 58 },
  ];
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - (72 / 100) * c;
  return (
    <div className="w-full">
      <div className="flex items-center gap-12 mb-8">
        <div className="relative w-[180px] h-[180px] flex-shrink-0 group">
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
              />
              <defs>
                <linearGradient id="featureScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center relative z-20">
              <div className="text-[52px] font-black text-white leading-none tabular-nums tracking-tighter">72</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-2">Index</div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            {dims.map((d) => (
              <div key={d.l} className="group/item">
                <div className="flex justify-between text-[11px] mb-2 font-black uppercase tracking-[0.2em]">
                  <span className="text-zinc-600 group-hover/item:text-zinc-400 transition-colors">{d.l}</span>
                  <span className="text-white font-mono tabular-nums opacity-40">{d.v}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.02] overflow-hidden border border-white/[0.02]">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out" 
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
  
  function MarketVisual() {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="relative w-full max-w-[360px] aspect-square">
          <div className="absolute -inset-10 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />
          {/* TAM */}
          <div className="absolute inset-0 rounded-[40px] border border-white/[0.05] bg-white/[0.01] flex items-start justify-start p-8 group hover:bg-white/[0.03] transition-all duration-500 shadow-2xl">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-2">TAM Estimation</div>
              <div className="text-[36px] font-black text-white tracking-tighter leading-none group-hover:scale-105 transition-transform origin-left">$24.8B</div>
            </div>
          </div>
          {/* SAM */}
          <div className="absolute inset-[15%] rounded-[32px] border border-blue-500/20 bg-blue-500/[0.04] flex items-start justify-start p-8 backdrop-blur-md shadow-2xl group hover:bg-blue-500/[0.06] transition-all">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400/60 mb-2">SAM Strategy</div>
              <div className="text-[32px] font-black text-white tracking-tighter leading-none">$6.2B</div>
            </div>
          </div>
          {/* SOM */}
          <div className="absolute inset-[32%] rounded-[24px] border border-purple-500/30 bg-purple-500/[0.08] flex items-center justify-center backdrop-blur-xl shadow-[0_0_60px_rgba(139,92,246,0.15)] group hover:scale-[1.02] transition-all">
            <div className="text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-purple-400/80 mb-2">Target SOM</div>
              <div className="text-[28px] font-black text-white tracking-tighter leading-none">$420M</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function KanbanVisual() {
    const cols = [
      { t: "Strategy", items: ["Market Fit", "Pricing Model"] },
      { t: "Dev", items: ["API Spec", "UI/UX"] },
      { t: "Growth", items: ["Early Access", "LTV Opt"] },
    ];
    return (
      <div className="w-full grid grid-cols-3 gap-5">
        {cols.map((col) => (
          <div key={col.t} className="rounded-3xl bg-white/[0.01] border border-white/[0.04] p-5 shadow-inner">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-6 flex justify-between items-center">
              <span>{col.t}</span>
              <span className="w-5 h-5 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-[9px] font-black text-zinc-500">{col.items.length}</span>
            </div>
            <div className="space-y-3.5">
              {col.items.map((it) => (
                <div
                  key={it}
                  className="rounded-2xl bg-[#121214] border border-white/[0.06] p-4 text-[13px] font-bold text-zinc-400 shadow-xl hover:text-white hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    {it}
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

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
    <div className="relative py-40 overflow-hidden group">
      <div className="section-container grid lg:grid-cols-2 gap-24 lg:gap-40 items-center">
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${reverse ? "lg:order-2" : ""} relative z-10`}
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] mb-10 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">
              {label}
            </span>
          </div>
          <h2
            className="text-[48px] md:text-[64px] font-black text-white leading-[1] mb-10 tracking-tighter"
          >
            {headline}
          </h2>
          <p className="text-[19px] text-zinc-500 leading-relaxed max-w-[540px] mb-12 font-medium">
            {body}
          </p>
          <button className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:text-blue-400 transition-all">
            Experience the Engine
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500 transition-all duration-500">
              <ArrowRight className="w-4 h-4 group-hover:scale-110" />
            </div>
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`${reverse ? "lg:order-1" : ""} relative`}
        >
          <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000" />
          <div className="rounded-[40px] border border-white/[0.06] bg-[#0C0C0E]/60 p-1.5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <div className="rounded-[36px] border border-white/[0.03] bg-[#0A0A0A] p-12 overflow-hidden shadow-inner">
              {visual}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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

export function Features() {
  return (
    <section id="features" className="bg-[#0A0A0A] relative z-10">
      <FeatureBlock
        label="Validation Intelligence"
        headline="AI that thinks like a serial founder"
        body="ValiSearch scores your idea across 6 critical dimensions. Get a 0-100 confidence score with deep technical and market reasoning for every pillar of your startup."
        visual={<ScoreVisual />}
      />
      <GlowDivider />
      <FeatureBlock
        reverse
        label="Market Dynamics"
        headline="Know your market before you spend a dollar"
        body="Real-time TAM, SAM, and SOM estimates powered by proprietary datasets. Map competitors and identify whitespace opportunities in seconds."
        visual={<MarketVisual />}
      />
      <GlowDivider />
      <FeatureBlock
        label="Engineering Blueprint"
        headline="Validation to build-ready in one session"
        body="The only platform that bridge the gap between idea and execution. Convert validated insights directly into actionable engineering tasks for your team."
        visual={<KanbanVisual />}
      />
    </section>
  );
}
