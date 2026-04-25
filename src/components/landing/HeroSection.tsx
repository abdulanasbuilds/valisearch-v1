import { useState } from 'react';
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";
import { AuthGateModal } from '@/components/auth/AuthGateModal'
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useUserStore } from '@/store/useUserStore';
import { sanitizeIdea } from '@/lib/sanitize';
import { MAX_IDEA_LENGTH } from '@/lib/constants';
import { toast } from 'sonner';

export function HeroSection() {
  const [idea, setIdea] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const navigate = useNavigate();
  const { runAnalysis, isAnalyzing } = useAnalysisStore();
  const { isAuthenticated } = useUserStore();

  const handleSubmit = async () => {
    if (idea.trim().length < 20) {
      toast.error('Please describe your idea in more detail.');
      return;
    }

    if (!isAuthenticated) {
      setShowAuthGate(true);
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
              <span className="label-allcaps">STRATEGIC STARTUP ANALYSIS</span>
              <div className="h-[1px] w-12 bg-white/10" />
            </div>
            
            <h1 className="display-headline mb-6 text-[42px] leading-[1.05] sm:text-6xl lg:text-7xl tracking-tight font-bold text-white">
              Validation for <br />
              <span className="text-primary">serious builders.</span>
            </h1>

            <p className="text-[18px] text-white/40 leading-relaxed max-w-[520px] mb-10 font-medium">
              ValiSearch transforms raw concepts into technical intelligence reports. 
              Built for founders who value data over intuition.
            </p>

            <div className="w-full max-w-[540px] mb-8">
              <div className={`relative rounded-xl border transition-all duration-300 ${isFocused ? 'border-primary/50 bg-primary/[0.02] shadow-[0_0_50px_-12px_rgba(108,71,255,0.2)]' : 'border-white/5 bg-white/[0.01]'}`}>
                <textarea
                  id="idea-input"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the problem, your proposed solution, and target audience..."
                  rows={5}
                  className="w-full bg-transparent px-5 pt-5 pb-2 text-white placeholder:text-white/10 resize-none outline-none text-[15px] leading-relaxed font-medium"
                />
                <div className="flex items-center justify-between px-5 pb-4 pt-1 border-t border-white/[0.03]">
                  <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
                    Press ⌘+Enter to begin analysis
                  </span>
                  <span className={`text-[10px] font-mono transition-colors ${idea.length > MAX_IDEA_LENGTH * 0.9 ? 'text-amber-500' : 'text-white/20'}`}>
                    {idea.length} / {MAX_IDEA_LENGTH}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isAnalyzing || idea.trim().length < 20}
                className="w-full mt-4 py-4 px-6 bg-white text-black font-bold rounded-xl text-[15px] hover:bg-white/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Running Analysis...
                  </>
                ) : (
                  'Start Validation'
                )}
              </button>
            </div>


            <div className="flex items-center gap-5">
              <button 
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-white text-[14px] font-semibold px-6 py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
              >
                <PlayCircle className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                See process
              </button>
            </div>

            <div className="mt-16 flex flex-col gap-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                POWERED BY
              </span>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-20 grayscale hover:opacity-40 transition-opacity font-bold text-[12px] tracking-tighter">
                 <span>OPENAI</span>
                 <span>SUPABASE</span>
                 <span>STRIPE</span>
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

      {showAuthGate && (
        <AuthGateModal
          idea={idea}
          onClose={() => setShowAuthGate(false)}
          onAuthSuccess={() => setShowAuthGate(false)}
        />
      )}
    </section>
  );
}
