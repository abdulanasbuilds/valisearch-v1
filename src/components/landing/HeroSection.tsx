import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative pt-[200px] pb-32 overflow-hidden">
      {/* Handcrafted atmospheric glow */}
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] glow-radial opacity-30 pointer-events-none" />
      
      <div className="section-container relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="label-allcaps mb-6 block">AI STARTUP INTELLIGENCE PLATFORM</span>
          
          <h1 className="display-headline mb-8 text-[#F0F0F0]">
            Validate your <br />
            <span className="text-serif-italic">startup idea</span> <br />
            before you build.
          </h1>

          <p className="text-[18px] text-[#888888] leading-relaxed max-w-[480px] mb-12">
            Turn a raw idea into a complete investor-ready intelligence report in 30 seconds. 
            Market sizing, competitor analysis, product strategy, branding, revenue models, 
            and a sprint-ready Kanban board.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto bg-[#6C47FF] hover:bg-[#7C5AFF] text-white text-[16px] font-semibold px-8 py-4 rounded-lg transition-all text-center"
            >
              Validate my idea free
            </Link>
            <Link 
              to="#how-it-works" 
              className="w-full sm:w-auto border border-white/15 hover:border-white/30 text-[#F0F0F0] text-[16px] font-medium px-8 py-4 rounded-lg transition-all text-center"
            >
              See how it works →
            </Link>
          </div>

          <div className="mt-20 pt-8 border-t border-white/[0.04]">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/30 block mb-6">
              Trusted by founders building at
            </span>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6 opacity-40 grayscale pointer-events-none">
              {["Stripe", "Vercel", "Linear", "Resend", "Loom"].map((name) => (
                <span key={name} className="text-[14px] font-bold tracking-tighter">{name}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
           {/* Mockup Frame */}
          <div className="mockup-container p-1 pointer-events-none">
            <div className="rounded-lg bg-[#0A0A0A] overflow-hidden">
              {/* Header */}
              <div className="h-10 border-b border-white/[0.06] bg-[#111] flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2 hs rounded-full bg-[#EF4444]/40 h-2" />
                  <div className="w-2 hs rounded-full bg-[#EAB308]/40 h-2" />
                  <div className="w-2 hs rounded-full bg-[#22C55E]/40 h-2" />
                </div>
                <div className="text-[10px] text-white/20 font-mono">valisearch.app/dashboard</div>
              </div>

              <div className="p-6 space-y-8">
                {/* Score Section */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/30 mb-1 block tracking-wider">IDEA SCORE</span>
                    <div className="text-4xl font-black text-[#22C55E]">72<span className="text-sm font-normal text-white/30 ml-1">/100</span></div>
                  </div>
                  <div className="flex gap-2">
                    {["Market", "Scale", "Trend"].map(m => (
                      <div key={m} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-bold text-white/40">{m}</div>
                    ))}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-[#22C55E]" />
                </div>

                {/* Summary Table */}
                <div className="space-y-3">
                   <div className="grid grid-cols-4 text-[9px] uppercase font-bold text-white/20 px-2 pb-1 border-b border-white/[0.04]">
                    <span>Dimension</span>
                    <span className="text-right">Score</span>
                    <span className="col-span-2 text-right">Verdict</span>
                   </div>
                   {[
                    { d: "Market Demand", s: "8/10", v: "Strong Interest" },
                    { d: "Stickiness", s: "7/10", v: "High LTV" },
                    { d: "Scalability", s: "6/10", v: "Moderate" }
                   ].map((row, i) => (
                    <div key={i} className="grid grid-cols-4 px-2 py-1.5 bg-white/[0.02] rounded-md border border-white/[0.04] text-[11px]">
                      <span className="font-medium text-white/80">{row.d}</span>
                      <span className="text-right text-[#22C55E] font-bold">{row.s}</span>
                      <span className="col-span-2 text-right text-white/40">{row.v}</span>
                    </div>
                   ))}
                </div>
              </div>
            </div>
          </div>

          {/* Callout Pills */}
          <div className="absolute -top-6 -right-6 px-4 py-2 bg-[#6C47FF] rounded-lg shadow-xl text-[12px] font-bold flex items-center gap-2 animate-bounce">
            72 Idea Score
          </div>
          <div className="absolute -bottom-8 -left-8 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl text-[12px] font-bold flex items-center gap-2">
             18 Analysis Sections
          </div>
        </motion.div>
      </div>
    </section>
  );
}
