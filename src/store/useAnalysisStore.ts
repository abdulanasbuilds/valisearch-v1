"use client";

import { create } from "zustand";
import type { ValiSearchAnalysis } from "@/types/analysis";
import type { AnalysisType } from "@/types/analysis-v2";
import { analyzeIdea, analyzeIdeaV2 } from "@/services/api";
import { useCreditStore } from "@/store/useCreditStore";
import { useUserStore } from "@/store/useUserStore";
import { saveAnalysis } from "@/services/database.service";
import { canAttemptAnalysis, recordAnalysisAttempt, getRemainingAttempts, getTimeUntilNextAttempt } from "@/lib/rate-limit";
import { normalizeAnalysis } from "@/lib/analysis-normalizer";
import { toast } from "sonner";

export type AnyAnalysis = ValiSearchAnalysis;

type AnalysisState = {
  idea: string;
  analysis: AnyAnalysis | null;
  isAnalyzing: boolean;
  activeSection: string;
  dataSource: "ai" | "mock" | null;
  error: string | null;
  credits: number;
  lastAnalysisId: string | null;

  setIdea: (idea: string) => void;
  setAnalysis: (a: AnyAnalysis | null) => void;
  setAnalyzing: (v: boolean) => void;
  setActiveSection: (id: string) => void;
  clearError: () => void;
  refreshCredits: () => void;
  runAnalysis: (idea: string, type?: AnalysisType) => Promise<void>;
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
  idea: "",
  analysis: null,
  isAnalyzing: false,
  activeSection: "overview",
  dataSource: null,
  error: null,
  credits: useCreditStore.getState().credits,
  lastAnalysisId: null,

  setIdea: (idea) => set({ idea }),
  setAnalysis: (analysis) => set({ analysis }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setActiveSection: (activeSection) => set({ activeSection }),
  clearError: () => set({ error: null }),
  refreshCredits: () => set({ credits: useCreditStore.getState().credits }),

  runAnalysis: async (idea: string, type: AnalysisType = "full") => {
    // Client-side rate limit check
    if (!canAttemptAnalysis()) {
      const waitMs = getTimeUntilNextAttempt();
      const waitMin = Math.ceil(waitMs / 60000);
      set({
        error: `Rate limit reached. You have ${getRemainingAttempts()} attempts remaining. Try again in ${waitMin} minute${waitMin !== 1 ? "s" : ""}.`,
      });
      return;
    }

    const creditCost = type === "quick" ? 1 : 2;

    // Check credits
    const hasCredits = useCreditStore.getState().credits >= creditCost;
    if (!hasCredits) {
      useCreditStore.getState().setShowUpgradeModal(true);
      set({ error: `Need ${creditCost} credits remaining. Upgrade to continue.` });
      return;
    }

    toast.info(`${creditCost} credit${creditCost > 1 ? "s" : ""} will be used for this analysis`);
    
    // deduct locally (edge function deducts from DB)
    useCreditStore.getState().deductCredit(creditCost);

    // Record attempt for rate limiting
    recordAnalysisAttempt();

    set({ idea, isAnalyzing: true, error: null, analysis: null, dataSource: null });
    try {
      const { result, source, analysisId } = await analyzeIdeaV2(idea, type);
      set({
        analysis: normalizeAnalysis(result, idea) as any,
        dataSource: source,
        isAnalyzing: false,
        credits: useCreditStore.getState().credits,
        lastAnalysisId: analysisId || null,
      });

      // No need to call saveAnalysis since Edge Function already saves it securely!
    } catch (e) {
      const message = e instanceof Error ? e.message : "Analysis failed";
      const fallback = normalizeAnalysis(null, idea) as any;
      set({ analysis: fallback, dataSource: "mock", error: null, isAnalyzing: false });
      toast.error(`${message}. Loaded a demo validation report so you can continue.`);
    }
  },
}));
