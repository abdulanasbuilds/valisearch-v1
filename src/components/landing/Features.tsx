import { motion } from "framer-motion";
import { Brain, Globe, Layout, ChevronRight } from "lucide-react";

function FeatureBlock({ label, headline, body, visual, reverse = false, icon: Icon }: { label: string, headline: string, body: React.ReactNode, visual: React.ReactNode, reverse?: boolean, icon: React.ElementType }) {
  return (
    <div className="py-40 relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${reverse ? 'left-[-10%]' : 'right-[-10%]'} w-[600px] h-[600px] bg-[#6C47FF]/[0.03] blur-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
      
      {/* Precision Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      
      <div className={`section-container grid lg:grid-cols-[1fr_1.1fr] gap-24 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={reverse ? 'lg:order-2' : ''}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#6C47FF]/10 flex items-center justify-center border border-[#6C47FF]/20">
               <Icon className="w-6 h-6 text-[#6C47FF]" />
            </div>
            <span className="label-allcaps">{label}</span>
          </div>
          
          <h2 className="text-[44px] lg:text-[54px] font-bold text-white mb-8 leading-[1.1] tracking-tight">{headline}</h2>
          <p className="text-[18px] text-[#888888] leading-relaxed max-w-[500px] mb-10 font-medium">
            {body}
          </p>
          
          <button className="flex items-center gap-2 text-[14px] font-bold text-white/40 hover:text-[#6C47FF] transition-colors group/btn">
             EXPLORE MODULE 
             <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`relative ${reverse ? 'lg:order-1' : ''}`}
        >
           {/* High-End Visual Container */}
           <div className="premium-card p-1 mockup-shadow relative z-10 group/visual">
              <div className="rounded-[14px] bg-[#0A0A0A] overflow-hidden border border-white/[0.05] p-10 flex items-center justify-center min-h-[440px]">
                {visual}
              </div>
              
              {/* Corner Accents */}
              <div className="absolute -top-px -left-px w-8 h-8 border-t border-l border-[#6C47FF]/40 rounded-tl-xl pointer-events-none" />
              <div className="absolute -bottom-px -right-px w-8 h-8 border-b border-r border-[#6C47FF]/40 rounded-br-xl pointer-events-none" />
           </div>

           {/* Backdrop Texture */}
           <div className="absolute inset-[-40px] bg-grid-white opacity-20 pointer-events-none z-0" />
        </motion.div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-[#0A0A0A]">
      <FeatureBlock 
        icon={Brain}
        label="CORE ENGINE"
        headline="AI that thinks like a serial founder"
        body="ValiSearch scores your idea across 18 specialized dimensions. Get a 0-100 confidence score backed by raw market data and specific execution logic."
        visual={
          <img 
            src="/screenshots/validation-feature.png" 
            alt="AI Validation Engine showing confidence scores" 
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        }
      />

      <FeatureBlock 
        reverse
        icon={Globe}
        label="MARKET INTELLIGENCE"
        headline="Global datasets. Real-time relevance."
        body="Access live TAM/SAM/SOM estimates derived from current market signals. No more guesswork or outdated whitepapers."
        visual={
          <img 
            src="/screenshots/competitor-feature.png" 
            alt="Market Intelligence showing TAM/SAM/SOM analyses" 
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        }
      />

      <FeatureBlock 
        icon={Layout}
        label="EXECUTION ENGINE"
        headline="Move from strategy to sprint in seconds"
        body="Every analysis generates a full functional backlog. Export your product roadmap directly to Linear, Jira, or Notion with one click."
        visual={
          <img 
            src="/screenshots/kanban-feature.png" 
            alt="Execution Engine with Linear export and roadmap" 
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        }
      />
    </section>
  );
}
