import { useState } from 'react';
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useUserStore } from '@/store/useUserStore';
import { sanitizeIdea } from '@/lib/sanitize';
import { MAX_IDEA_LENGTH } from '@/lib/constants';
import { toast } from 'sonner';

export function HeroSection() {
  const [idea, setIdea] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { runAnalysis, isAnalyzing } = useAnalysisStore();
  const { isAuthenticated } = useUserStore();

  const handleSubmit = async () => {
    if (idea.trim().length < 20) {
      toast.error('Please describe your idea in at least 20 characters.');
      return;
    }
    
    if (!isAuthenticated) {
      // Store idea in sessionStorage so we can restore it after login
      sessionStorage.setItem('pending-idea', idea);
      toast.info('Please sign in to validate your idea.');
      navigate('/login');
      return;
    }
    
    const sanitized = sanitizeIdea(idea);
    navigate('/analyze');
    await runAnalysis(sanitized);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-[180px] pb-32 overflow-hidden bg-grid-white">
      {/* Background Atmosphere */}
      <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-[#6C47FF]/[0.05] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#6C47FF]/[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="label-allcaps">AI STARTUP INTELLIGENCE</span>
              <div className="h-[1px] w-12 bg-white/10" />
            </div>
            
            <h1 className="display-headline mb-6 text-4xl sm:text-5xl lg:text-6xl">
              Validate your <br />
              <span className="text-serif-italic">startup idea</span> <br />
              before you build.
            </h1>

            <p className="text-[17px] text-[#888888] leading-relaxed max-w-[500px] mb-8 font-medium">
              Turn raw concepts into investor-ready intelligence reports in 30 seconds. 
              The ultimate validation stack for serial founders, built by <span className="text-white font-bold">Abdul Anas</span>.
            </p>

            <div className="w-full max-w-[500px] mb-6">
              <div className={`relative rounded-xl border transition-colors ${isFocused ? 'border-[#6C47FF]/60 ring-2 ring-[#6C47FF]/20' : 'border-white/10'} bg-white/[0.03]`}>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your startup idea... e.g. An AI tool that validates startup ideas before founders invest months building them."
                  rows={4}
                  className="w-full bg-transparent px-4 pt-4 pb-2 text-foreground placeholder:text-muted-foreground/50 resize-none outline-none text-base leading-relaxed"
                />
                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                  <span className="text-xs text-muted-foreground/50">
                    ⌘ + Enter to submit
                  </span>
                  <span className={`text-xs transition-colors ${idea.length > MAX_IDEA_LENGTH * 0.9 ? 'text-amber-400' : 'text-muted-foreground/50'}`}>
                    {idea.length} / {MAX_IDEA_LENGTH}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isAnalyzing || idea.trim().length < 20}
                className="w-full mt-3 py-3.5 px-6 bg-[#6C47FF] text-white font-semibold rounded-xl text-base hover:bg-[#7C5AFF] transition-all shadow-[0_10px_30px_rgba(108,71,255,0.25)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analysing your idea...
                  </>
                ) : (
                  <>Validate my idea free <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>

            <div className="flex items-center gap-5">
              <button 
                onClick={handleScrollToHowItWorks}
                className="w-full sm:w-auto bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-[#F0F0F0] text-[15px] font-semibold px-6 py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2 group"
              >
                <PlayCircle className="w-4 h-4 text-white/40 group-hover:text-[#6C47FF] transition-colors" />
                See how it works
              </button>
            </div>

            <div className="mt-16 flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                PROVEN_TECH_STACK
              </span>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 opacity-30 grayscale contrast-125 font-black text-[13px]">
                 <span>OPENAI</span>
                 <span>SUPABASE</span>
                 <span>REPLICATE</span>
                 <span>LEMON SQUEEZY</span>
                 <span>VERCEL</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Depth glows */}
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#6C47FF]/10 blur-[120px] rounded-full opacity-50 animate-pulse pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-[#6C47FF]/05 blur-[100px] rounded-full opacity-30 pointer-events-none" />

            <div className="relative z-10 scale-[0.85] origin-top-left w-[115%]">
              <DashboardMockup />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
