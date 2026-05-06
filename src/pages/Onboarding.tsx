import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { getSupabase } from "@/lib/supabase";
import { sanitizeIdea } from "@/lib/sanitize";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Briefcase, Code, Lightbulb, Rocket, Sparkles, Target, TrendingUp, Users } from "lucide-react";

const ROLES = [
  { id: "founder", label: "Solo Founder", icon: Rocket },
  { id: "indie", label: "Indie Hacker", icon: Code },
  { id: "pm", label: "Product Manager", icon: Briefcase },
  { id: "exploring", label: "Just Exploring", icon: Lightbulb },
];

const GOALS = [
  { id: "validate", label: "Validate a new idea", icon: Target },
  { id: "research", label: "Research a market", icon: TrendingUp },
  { id: "competitors", label: "Map competitors", icon: Users },
  { id: "build", label: "Plan a build", icon: Code },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { user, refreshProfile } = useUserStore();
  const { runAnalysis, setIdea: setStoreIdea } = useAnalysisStore();

  const totalSteps = 3;
  const progress = ((step - 1) / totalSteps) * 100 + 33;

  const persistOnboarding = async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    try {
      await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
        })
        .eq("id", user.id);
      // Persist segmentation as user metadata (no schema change required)
      await supabase.auth.updateUser({
        data: { role, goal, onboarded_at: new Date().toISOString() },
      });
      await refreshProfile();
    } catch (e) {
      console.warn("onboarding persist failed", e);
    }
  };

  const handleSkip = async () => {
    await persistOnboarding();
    navigate("/workspace", { replace: true });
  };

  const handleValidate = async () => {
    if (idea.trim().length < 20) return;
    await persistOnboarding();
    const sanitized = sanitizeIdea(idea);
    setStoreIdea(sanitized);
    await runAnalysis(sanitized, "full");
    const id = useAnalysisStore.getState().lastAnalysisId;
    navigate(id ? `/workspace/${id}` : "/dashboard/overview", { replace: true });
  };

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Founder";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Step {step} of {totalSteps}
            </span>
            <button onClick={handleSkip} className="text-[11px] font-semibold text-zinc-500 hover:text-white transition-colors">
              Skip for now
            </button>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "33%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Welcome to ValiSearch</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
                Hey {firstName} 👋 What best describes you?
              </h1>
              <p className="text-zinc-400 mb-8">
                We'll tailor your workspace, templates, and recommendations to match your workflow.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`group p-5 rounded-2xl border transition-all text-left ${
                        active
                          ? "bg-white text-black border-white"
                          : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.05]"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-3 ${active ? "text-black" : "text-zinc-400"}`} />
                      <div className="text-sm font-bold">{r.label}</div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
                What brings you here today?
              </h1>
              <p className="text-zinc-400 mb-8">Pick your primary goal — you can always switch focus later.</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {GOALS.map((g) => {
                  const Icon = g.icon;
                  const active = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`p-5 rounded-2xl border transition-all text-left ${
                        active
                          ? "bg-white text-black border-white"
                          : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.05]"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-3 ${active ? "text-black" : "text-zinc-400"}`} />
                      <div className="text-sm font-bold">{g.label}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-xl font-bold text-sm transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => goal && setStep(3)}
                  disabled={!goal}
                  className="flex-[2] h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
                Drop your first idea ✨
              </h1>
              <p className="text-zinc-400 mb-6">
                We'll run a free deep-validation now — TAM, competitors, GTM, and a build plan in 90 seconds.
              </p>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value.slice(0, 2000))}
                placeholder="E.g. An AI sous-chef that turns photos of your fridge into 5-ingredient dinner recipes for busy parents…"
                rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 resize-none outline-none focus:border-white/30 focus:bg-black/60 transition-all mb-2 text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between mb-6 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                <span>{idea.length} / 2000</span>
                <span>{idea.trim().length >= 20 ? "Ready to validate" : "Min. 20 characters"}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 h-12 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-xl font-bold text-sm transition-all"
                >
                  Explore workspace first
                </button>
                <button
                  onClick={handleValidate}
                  disabled={idea.trim().length < 20}
                  className="flex-[2] h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  Validate it now <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
