import { create } from "zustand";
import type { ValiSearchAnalysis } from "@/types/analysis";
import { analyzeIdea, getCredits, hasAnyApiKey } from "@/services/api";

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
  credits: getCredits(),

  setIdea: (idea) => set({ idea }),
  setAnalysis: (analysis) => set({ analysis }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setActiveSection: (activeSection) => set({ activeSection }),
  clearError: () => set({ error: null }),
  refreshCredits: () => set({ credits: getCredits() }),

  runAnalysis: async (idea: string) => {
    set({ idea, isAnalyzing: true, error: null, analysis: null, dataSource: null });
    try {
      const { result, source } = await analyzeIdea(idea);
      set({ analysis: result, dataSource: source, isAnalyzing: false, credits: getCredits() });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Analysis failed";
      set({ error: message, isAnalyzing: false });
    }
  },
}));
