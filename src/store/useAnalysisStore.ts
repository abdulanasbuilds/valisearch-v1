import { create } from "zustand";
import type { ValiSearchAnalysis } from "@/types/analysis";
import { analyzeIdea } from "@/services/api";
import { useCreditStore } from "@/store/useCreditStore";
import { useUserStore } from "@/store/useUserStore";
import { saveAnalysis } from "@/services/database.service";
import { canAttemptAnalysis, recordAnalysisAttempt, getRemainingAttempts, getTimeUntilNextAttempt } from "@/lib/rate-limit";

type AnalysisState = {
  idea: string;
  analysis: ValiSearchAnalysis | null;
  isAnalyzing: boolean;
  activeSection: string;
  dataSource: "ai" | "mock" | null;
  error: string | null;
  credits: number;

  setIdea: (idea: string) => void;
  setAnalysis: (a: ValiSearchAnalysis | null) => void;
  setAnalyzing: (v: boolean) => void;
  setActiveSection: (id: string) => void;
  clearError: () => void;
  refreshCredits: () => void;
  runAnalysis: (idea: string) => Promise<void>;
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
  idea: "",
  analysis: null,
  isAnalyzing: false,
  activeSection: "overview",
  dataSource: null,
  error: null,
  credits: useCreditStore.getState().credits,

  setIdea: (idea) => set({ idea }),
  setAnalysis: (analysis) => set({ analysis }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setActiveSection: (activeSection) => set({ activeSection }),
  clearError: () => set({ error: null }),
  refreshCredits: () => set({ credits: useCreditStore.getState().credits }),

  runAnalysis: async (idea: string) => {
    // Client-side rate limit check
    if (!canAttemptAnalysis()) {
      const waitMs = getTimeUntilNextAttempt();
      const waitMin = Math.ceil(waitMs / 60000);
      set({
        error: `Rate limit reached. You have ${getRemainingAttempts()} attempts remaining. Try again in ${waitMin} minute${waitMin !== 1 ? "s" : ""}.`,
      });
      return;
    }

    // Check credits
    const canProceed = useCreditStore.getState().deductCredit();
    if (!canProceed) {
      set({ error: "No credits remaining. Upgrade to continue." });
      return;
    }

    // Record attempt for rate limiting
    recordAnalysisAttempt();

    set({ idea, isAnalyzing: true, error: null, analysis: null, dataSource: null });
    try {
      const { result, source } = await analyzeIdea(idea);
      set({
        analysis: result,
        dataSource: source,
        isAnalyzing: false,
        credits: useCreditStore.getState().credits,
      });

      // Persist to database if user is logged in
      const user = useUserStore.getState().user;
      if (user) {
        saveAnalysis(user.id, idea, result, source).catch((e) =>
          console.warn("[store] Failed to persist analysis:", e)
        );
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Analysis failed";
      set({ error: message, isAnalyzing: false });
    }
  },
}));
