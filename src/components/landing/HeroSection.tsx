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
    <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-64 overflow-hidden bg-[#0A0A0A] flex flex-col items-center">
      {/* Background Lighting - Subtle and layered */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[800px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none opacity-30" />
      
      <div className="section-container relative z-10 w-full flex flex-col items-center">
        
        {/* Human Touch - Built By Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              Built by Abdul Anas
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full max-w-4xl mb-16"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8">
            Build with <span className="text-zinc-500">certainty.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            The validation engine for serious founders. Analyze markets, map personas, and plan your MVP in seconds, not months.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto px-4"
        >
          {/* Prompt Box - Highly refined */}
          <div className={`relative rounded-[24px] border transition-all duration-700 bg-zinc-900/40 backdrop-blur-3xl shadow-2xl ${isFocused ? 'border-white/20 ring-1 ring-white/10' : 'border-white/10'}`}>
            <div className="px-8 py-8 pb-24">
              <textarea
                id="idea-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your startup idea..."
                rows={3}
                className="w-full bg-transparent text-white placeholder:text-zinc-700 resize-none outline-none text-2xl leading-tight font-semibold tracking-tight"
              />
            </div>
            
            <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-600 hover:text-zinc-300 group" title="Attach context">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-600 hover:text-zinc-300 group" title="Refine description">
                  <Sparkles className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                </button>
              </div>
              
              <div className="flex items-center gap-8">
                <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${idea.length > MAX_IDEA_LENGTH * 0.9 ? 'text-amber-500' : 'text-zinc-700'}`}>
                  {idea.length} / {MAX_IDEA_LENGTH}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={isAnalyzing || idea.trim().length < 15}
                  className="group py-3 px-8 bg-white text-black font-black rounded-2xl text-[13px] uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-white/5"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Validate
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Refined suggestions */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['SaaS for creators', 'Local marketplace', 'Dev tool', 'AI vertical'].map(tag => (
              <button 
                key={tag}
                onClick={() => setIdea(`I want to build a ${tag} that...`)}
                className="px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02] text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white hover:border-white/20 transition-all duration-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Logo Strip - More professional */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-40 w-full max-w-5xl mx-auto"
        >
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-black text-zinc-700 tracking-[0.3em] uppercase mb-12">
              Empowering the next generation of builders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-12 opacity-20 grayscale hover:opacity-50 transition-all duration-1000">
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
          onAuthSuccess={() => setShowAuthGate(false)}
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