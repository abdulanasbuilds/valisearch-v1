import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";
import { SmartScreenshot } from "./SmartScreenshot";

export function HeroSection() {
  return (
    <section className="relative pt-[220px] pb-40 overflow-hidden bg-grid-white">
      {/* Background Atmosphere */}
      <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-[#6C47FF]/[0.05] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#6C47FF]/[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-20 items-center">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-8">
              <span className="label-allcaps">AI STARTUP INTELLIGENCE</span>
              <div className="h-[1px] w-12 bg-white/10" />
            </div>
            
            <h1 className="display-headline mb-8">
              Validate your <br />
              <span className="text-serif-italic">startup idea</span> <br />
              before you build.
            </h1>

            <p className="text-[19px] text-[#888888] leading-relaxed max-w-[520px] mb-12 font-medium">
              Turn raw concepts into investor-ready intelligence reports in 30 seconds. 
              The ultimate validation stack for serial founders, built by <span className="text-white font-bold">Abdul Anas</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-[#6C47FF] hover:bg-[#7C5AFF] text-white text-[16px] font-black px-10 py-5 rounded-xl transition-all shadow-[0_20px_40px_rgba(108,71,255,0.25)] flex items-center justify-center gap-2 group"
              >
                Validate My Idea Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                className="w-full sm:w-auto bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-[#F0F0F0] text-[16px] font-semibold px-10 py-5 rounded-xl transition-all text-center flex items-center justify-center gap-2 group"
              >
                <PlayCircle className="w-5 h-5 text-white/40 group-hover:text-[#6C47FF] transition-colors" />
                Watch Demo
              </button>
            </div>

            <div className="mt-24 flex flex-col gap-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">
                PROVEN_TECH_STACK
              </span>
              <div className="flex flex-wrap items-center gap-x-12 gap-y-6 opacity-30 grayscale contrast-125 font-black text-[14px]">
                 <span>OPENAI</span>
                 <span>SUPABASE</span>
                 <span>REPLICATE</span>
                 <span>STRIPE</span>
                 <span>VERCEL</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Real Demo Recording */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Depth glows */}
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#6C47FF]/10 blur-[120px] rounded-full opacity-50 animate-pulse pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-[#6C47FF]/05 blur-[100px] rounded-full opacity-30 pointer-events-none" />

            {/* Browser Wrapper for recording */}
            <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 bg-[#0D0D0D]">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#161616] border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-4 bg-[#1C1C1C] rounded-md px-3 py-1 text-[11px] text-white/30 font-mono">
                  valisearch.app/dashboard
                </div>
              </div>
              
              <div className="relative aspect-video">
                <img 
                  src="/videos/demo.webp" 
                  alt="ValiSearch App Demo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
