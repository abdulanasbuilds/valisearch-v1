"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, Paperclip, Sparkles, ArrowRight } from "lucide-react";
import { AuthGateModal } from '@/components/auth/AuthGateModal';
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
  const { runAnalysis, isAnalyzing, setIdea: setStoreIdea } = useAnalysisStore();
  const { isAuthenticated } = useUserStore();

  const handleSubmit = async () => {
    if (idea.trim().length < 15) {
      toast.error('Please describe your idea in a bit more detail.');
      return;
    }

    if (!isAuthenticated) {
      setShowAuthGate(true);
      return;
    }

    const sanitized = sanitizeIdea(idea);
    setStoreIdea(sanitized);
    navigate('/analyze');
    await runAnalysis(sanitized);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="relative pt-24 pb-24 sm:pt-32 sm:pb-40 lg:pt-48 lg:pb-56 overflow-hidden bg-[#0A0A0A] flex flex-col items-center">
      {/* Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] sm:h-[800px] bg-blue-600/10 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] sm:h-[600px] bg-purple-600/5 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none opacity-30" />

      <div className="section-container relative z-10 w-full flex flex-col items-center">

        {/* Built-by badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              Built by <a href="https://www.linkedin.com/in/abdul-anas-0161b3370" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Abdul Anas</a>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full max-w-4xl mb-10 sm:mb-14"
        >
          <h1 className="text-[40px] xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1] sm:leading-[0.95] tracking-tight mb-5 sm:mb-8">
            Build with <span className="text-zinc-500">certainty.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium px-2">
            The validation engine for serious founders. Analyze markets, map personas, and plan your MVP in seconds, not months.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto"
        >
          {/* Prompt Box — bolt.new / lovable.dev inspired */}
          <div className={`group relative rounded-2xl sm:rounded-[24px] border transition-all duration-500 bg-zinc-900/60 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] ${isFocused ? 'border-white/20 ring-1 ring-white/10 shadow-[0_30px_120px_-20px_rgba(59,130,246,0.25)]' : 'border-white/10'}`}>
            <div className="px-4 pt-4 sm:px-6 sm:pt-6">
              <textarea
                id="idea-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your startup idea in a sentence or two..."
                rows={3}
                className="w-full bg-transparent text-white placeholder:text-zinc-600 resize-none outline-none text-base sm:text-lg lg:text-xl leading-snug font-medium tracking-tight min-h-[88px] sm:min-h-[100px]"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4 sm:py-4 border-t border-white/[0.04]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 sm:p-2.5 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-zinc-200"
                  title="Attach context"
                >
                  <Paperclip className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  type="button"
                  className="p-2 sm:p-2.5 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-blue-400"
                  title="Refine with AI"
                >
                  <Sparkles className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </button>
                <span className={`hidden sm:inline ml-2 text-[10px] font-bold tracking-[0.18em] uppercase tabular-nums ${idea.length > MAX_IDEA_LENGTH * 0.9 ? 'text-amber-500' : 'text-zinc-600'}`}>
                  {idea.length}/{MAX_IDEA_LENGTH}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isAnalyzing || idea.trim().length < 15}
                className="group/btn h-10 sm:h-11 px-4 sm:px-6 bg-white text-black font-bold rounded-xl text-[12px] sm:text-[13px] uppercase tracking-[0.14em] hover:bg-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.97] shadow-lg shadow-white/5"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Validate</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile counter */}
          <div className="sm:hidden mt-2 px-1 text-right">
            <span className={`text-[10px] font-bold tracking-[0.18em] uppercase tabular-nums ${idea.length > MAX_IDEA_LENGTH * 0.9 ? 'text-amber-500' : 'text-zinc-600'}`}>
              {idea.length}/{MAX_IDEA_LENGTH}
            </span>
          </div>

          {/* Suggestions */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {['SaaS for creators', 'Local marketplace', 'Dev tool', 'AI vertical'].map(tag => (
              <button
                key={tag}
                onClick={() => setIdea(`I want to build a ${tag} that `)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-white/[0.06] bg-white/[0.02] text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-[0.14em] sm:tracking-widest hover:text-white hover:border-white/20 transition-all duration-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Logo Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 sm:mt-32 lg:mt-40 w-full max-w-5xl mx-auto"
        >
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-black text-zinc-700 tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-8 sm:mb-12 text-center px-4">
              Empowering the next generation of builders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 sm:gap-x-16 sm:gap-y-10 lg:gap-x-20 lg:gap-y-12 opacity-30 grayscale hover:opacity-60 transition-all duration-1000">
              <CompanyLogo name="VELOCITY" />
              <CompanyLogo name="QUANTUM" />
              <CompanyLogo name="NEXUS" />
              <CompanyLogo name="ORBIT" />
              <CompanyLogo name="LUMINA" />
            </div>
          </div>
        </motion.div>
      </div>

      {showAuthGate && (
        <AuthGateModal
          idea={idea}
          onClose={() => setShowAuthGate(false)}
          onAuthSuccess={async () => {
            setShowAuthGate(false);
            if (idea.trim().length >= 15) {
              const sanitized = sanitizeIdea(idea);
              setStoreIdea(sanitized);
              navigate('/analyze');
              await runAnalysis(sanitized);
            }
          }}
        />
      )}
    </section>
  );
}

function CompanyLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 select-none group">
      <div className="w-6 h-6 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/5 transition-all group-hover:bg-white group-hover:border-white">
        <div className="w-2.5 h-2.5 bg-zinc-700 rounded-sm group-hover:bg-black transition-colors" />
      </div>
      <span className="text-[16px] font-black tracking-tighter transition-colors group-hover:text-white">
        {name}
      </span>
    </div>
  );
}