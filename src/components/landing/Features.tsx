import { motion } from "framer-motion";

function FeatureBlock({ label, headline, body, visual, reverse = false }: any) {
  return (
    <div className="py-32 relative overflow-hidden">
      {/* Panvault-style glow divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6C47FF]/10 to-transparent" />
      
      <div className={`section-container grid lg:grid-cols-[1fr_1fr] gap-20 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={reverse ? 'lg:order-2' : ''}
        >
          <span className="label-allcaps mb-6 block">{label}</span>
          <h2 className="section-headline text-[#F0F0F0] mb-6">{headline}</h2>
          <p className="text-[17px] text-[#888888] leading-relaxed max-w-[480px]">
            {body}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`relative ${reverse ? 'lg:order-1' : ''}`}
        >
           {/* Visual Mockup Container */}
           <div className="aspect-[4/3] rounded-2xl border border-white/[0.08] bg-[#111] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-[#6C47FF]/[0.02] group-hover:bg-[#6C47FF]/[0.04] transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                {visual}
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-[#0A0A0A]">
      <FeatureBlock 
        label="VALIDATION ENGINE"
        headline="AI that thinks like a serial founder"
        body="ValiSearch scores your idea across 6 dimensions — uniqueness, market demand, stickiness, monetization potential, scalability, and technical complexity. Get a 0-100 confidence score with specific reasoning for every dimension."
        visual={
          <div className="text-center">
            <div className="text-[80px] font-black text-[#22C55E] leading-none mb-2">72</div>
            <div className="text-[14px] font-bold text-white/30 tracking-widest uppercase">Idea Score</div>
            <div className="mt-8 grid grid-cols-3 gap-2">
              {[8, 7, 7, 6, 9, 8].map((s, i) => (
                <div key={i} className="h-12 w-1 bg-white/[0.05] rounded-full overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-[#6C47FF]" style={{ height: `${s*10}%` }} />
                </div>
              ))}
            </div>
          </div>
        }
      />

      <FeatureBlock 
        reverse
        label="MARKET INTELLIGENCE"
        headline="Know your market before you spend a dollar"
        body="Real TAM, SAM, and SOM estimates with sourced reasoning. Google Trends integration shows whether your market is growing or shrinking. Competitor landscape maps show exactly where gaps exist."
        visual={
          <div className="w-full space-y-4">
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-bold text-white/30">TAM</span>
                <span className="text-[18px] font-bold text-[#F0F0F0]">$2.4B</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#6C47FF]" />
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] ml-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-bold text-white/30">SAM</span>
                <span className="text-[18px] font-bold text-[#F0F0F0]">$480M</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full w-[40%] bg-[#6C47FF]" />
              </div>
            </div>
          </div>
        }
      />

      <FeatureBlock 
        label="SPRINT PLANNER"
        headline="Validation to build-ready in one session"
        body="The only validation platform with a built-in Kanban sprint board. Your validated features become actionable development tasks — drag, prioritize, and export to Linear, Jira, or Notion."
        visual={
          <div className="grid grid-cols-3 gap-2 w-full h-full opacity-60">
            {[1, 2, 3].map(col => (
               <div key={col} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-2 flex flex-col gap-2">
                  <div className="h-1 w-8 bg-white/[0.08] rounded-full mb-2" />
                  {[1, 2].map(card => (
                    <div key={card} className="h-12 bg-white/[0.04] border border-white/[0.06] rounded-md p-2">
                       <div className="h-1 w-full bg-white/[0.08] rounded-full mb-2" />
                       <div className="h-1 w-[60%] bg-white/[0.08] rounded-full" />
                    </div>
                  ))}
               </div>
            ))}
          </div>
        }
      />
    </section>
  );
}
