import { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Loader2 } from "lucide-react";
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
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      <div className="section-container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              For founders building the future
            </span>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
              Know before you build.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-lg mx-auto mb-10">
              Get a comprehensive analysis of your startup idea in seconds. 
              Validate the market, understand the competition, and plan your path to revenue.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-lg mx-auto"
          >
            <div className={`relative rounded-xl border transition-all duration-300 ${isFocused ? 'border-zinc-600 bg-zinc-900/50' : 'border-zinc-800 bg-zinc-900/30'}`}>
              <textarea
                id="idea-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you're building and who it's for..."
                rows={4}
                className="w-full bg-transparent px-4 py-3 text-zinc-100 placeholder:text-zinc-600 resize-none outline-none text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-zinc-800">
                <span className="text-xs text-zinc-600">
                  {idea.trim().length > 0 ? 'Press Ctrl+Enter to validate' : 'Ctrl+Enter to run'}
                </span>
                <span className={`text-xs font-mono ${idea.length > MAX_IDEA_LENGTH * 0.9 ? 'text-amber-500' : 'text-zinc-600'}`}>
                  {idea.length}/{MAX_IDEA_LENGTH}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isAnalyzing || idea.trim().length < 15}
              className="w-full mt-4 py-3.5 px-6 bg-zinc-100 text-zinc-900 font-semibold rounded-lg text-sm hover:bg-zinc-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Validate My Idea
                </>
              )}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-px h-3 bg-zinc-800" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-px h-3 bg-zinc-800" />
              <span>15 free analyses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-px h-3 bg-zinc-800" />
              <span>Takes 15 seconds</span>
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