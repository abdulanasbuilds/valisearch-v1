import { motion } from "framer-motion";

export function ProductPreview() {
  return (
    <section className="py-32 relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-headline text-[#F0F0F0] mb-4">See your idea transformed</h2>
          <p className="text-[16px] text-[#888888] max-w-[500px] mx-auto">
            Every analysis section is interactive. Navigate, explore, and export your intelligence.
          </p>
        </div>

        {/* Browser Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-[1100px] mx-auto"
        >
          <div className="rounded-xl border border-white/[0.08] bg-[#111] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.7)]">
            {/* Browser Chrome */}
            <div className="h-11 bg-[#1A1A1A] border-b border-white/[0.06] flex items-center px-4 gap-2">
              <div className="flex gap-1.5 mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308]/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/30" />
              </div>
              <div className="flex-1 h-7 bg-white/[0.04] rounded-md border border-white/[0.04] flex items-center justify-center text-[10px] text-white/30 truncate px-4">
                valisearch.app/analysis/mvp-builder-platform
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="flex h-[500px] overflow-hidden">
               {/* Mini Sidebar */}
               <div className="w-48 bg-[#0D0D0D] border-r border-white/[0.04] p-4 flex flex-col gap-3">
                  {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className={`h-2 rounded-full w-full ${i === 1 ? 'bg-[#6C47FF]/40' : 'bg-white/[0.04]'}`} />
                  ))}
                  <div className="mt-auto h-4 w-10 bg-white/[0.04] rounded-full" />
               </div>
               {/* Main Canvas */}
               <div className="flex-1 p-10 space-y-8">
                  <div className="w-32 h-4 bg-white/[0.04] rounded-full" />
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="h-40 bg-white/[0.02] border border-white/[0.04] rounded-xl" />
                        <div className="h-2 w-full bg-white/[0.04] rounded-full" />
                        <div className="h-2 w-3/4 bg-white/[0.04] rounded-full" />
                     </div>
                     <div className="space-y-4">
                        <div className="h-60 bg-[#1A1A1A] border border-[#6C47FF]/20 rounded-xl" />
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Callout Pills */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
             <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-widest">
                <span>←</span> 0-100 Idea Score
             </div>
             <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-widest">
                 <span>↓</span> 18 Analysis Sections
             </div>
             <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-widest">
                 Kanban Sprint Board <span>→</span>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="py-[160px] relative overflow-hidden">
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-radial opacity-20 pointer-events-none" />
      
      <div className="section-container text-center relative z-10">
        <h2 className="text-[54px] md:text-[64px] font-black text-[#F0F0F0] leading-[1.1] tracking-tighter mb-8">
           Ready to stop guessing?
        </h2>
        <p className="text-[18px] text-[#888888] mb-12 max-w-[500px] mx-auto leading-relaxed">
           Join thousands of founders who validated before they built. 
           Start your first analysis in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-[#6C47FF] hover:bg-[#7C5AFF] text-white text-[16px] font-semibold px-8 py-4 rounded-lg transition-all">
            Validate my idea free
          </button>
          <button className="w-full sm:w-auto border border-white/10 hover:border-white/20 text-[#F0F0F0] text-[16px] font-medium px-8 py-4 rounded-lg transition-all">
            See pricing →
          </button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-20 border-t border-white/[0.06] bg-[#0A0A0A]">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="text-[16px] font-bold text-white mb-4">ValiSearch</div>
            <p className="text-[13px] text-white/40 max-w-[200px] leading-relaxed mb-6">
              The AI startup intelligence platform for founders.
            </p>
            <div className="text-[11px] font-medium text-white/20">
               Built in Ghana 🇬🇭
            </div>
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-white/80 uppercase tracking-widest mb-6">Product</h4>
            <ul className="text-[13px] text-white/40 space-y-4">
               {["How it works", "Features", "Pricing", "Changelog", "Roadmap"].map(i => <li key={i} className="hover:text-white transition-colors cursor-pointer">{i}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-white/80 uppercase tracking-widest mb-6">Resources</h4>
            <ul className="text-[13px] text-white/40 space-y-4">
               {["Documentation", "API", "Blog", "Templates", "Guides"].map(i => <li key={i} className="hover:text-white transition-colors cursor-pointer">{i}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-white/80 uppercase tracking-widest mb-6">Social</h4>
            <ul className="text-[13px] text-white/40 space-y-4">
               {["Twitter", "LinkedIn", "GitHub", "Medium"].map(i => <li key={i} className="hover:text-white transition-colors cursor-pointer">{i}</li>)}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.04]">
           <span className="text-[12px] text-white/20">© 2026 ValiSearch. All rights reserved.</span>
           <span className="text-[12px] text-white/20 mt-4 md:mt-0">Made for founders who build.</span>
        </div>
      </div>
    </footer>
  );
}
