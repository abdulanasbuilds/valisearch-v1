import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { getSupabase } from "@/lib/supabase";
import { sanitizeIdea } from "@/lib/sanitize";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { runAnalysis } = useAnalysisStore();

  const markOnboardingComplete = async () => {
    const supabase = getSupabase();
    if (supabase && user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
    }
  };

  const handleNext = () => setStep(step + 1);

  const handleSkip = async () => {
    await markOnboardingComplete();
    navigate("/workspace");
  };

  const handleValidate = async () => {
    if (idea.trim().length < 20) return;
    await markOnboardingComplete();
    navigate("/analyze");
    await runAnalysis(sanitizeIdea(idea));
  };

  const firstName = user?.email?.split('@')[0] || "Founder";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-4">
      <div className="max-w-md w-full relative">
        
        {step === 1 && (
          <div className="p-10 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-xl shadow-2xl text-center animate-in fade-in zoom-in duration-300">
            <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
              Welcome, {firstName}!
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              You have 15 free validations ready.
            </p>
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8 relative">
              <span className="text-2xl font-bold text-primary animate-pulse">0-100</span>
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl text-lg hover:bg-primary/90 transition-all"
            >
              Let's go →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-10 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-xl shadow-2xl text-center animate-in fade-in slide-in-from-right duration-300">
            <h1 className="text-2xl font-bold text-white mb-6 tracking-tight">
              Quick tour
            </h1>
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center gap-4">
                <div className="text-2xl">🎯</div>
                <div className="text-foreground text-sm font-medium">Score your idea 0-100</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl">🔍</div>
                <div className="text-foreground text-sm font-medium">Map your competitors</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl">🚀</div>
                <div className="text-foreground text-sm font-medium">Get a sprint-ready build plan</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleNext}
                className="w-full py-3.5 px-6 bg-primary text-white font-bold rounded-xl text-[15px] hover:bg-primary/90 transition-all"
              >
                Got it →
              </button>
              <button
                onClick={handleSkip}
                className="w-full py-3 px-6 text-muted-foreground font-semibold rounded-xl text-sm hover:text-foreground transition-all"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-10 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-xl shadow-2xl text-center animate-in fade-in slide-in-from-right duration-300">
            <h1 className="text-2xl font-bold text-white mb-6 tracking-tight">
              What's your first startup idea?
            </h1>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value.slice(0, 2000))}
              placeholder="Describe the problem, your proposed solution, and target audience..."
              rows={4}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 resize-none outline-none focus:border-primary/50 transition-colors mb-6 text-sm"
            />
            <div className="flex flex-col gap-3">
              <button
                onClick={handleValidate}
                disabled={idea.trim().length < 20}
                className="w-full py-3.5 px-6 bg-primary text-white font-bold rounded-xl text-[15px] hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Validate it →
              </button>
              <button
                onClick={handleSkip}
                className="w-full py-3 px-6 text-muted-foreground font-semibold rounded-xl text-sm hover:text-foreground transition-all"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}