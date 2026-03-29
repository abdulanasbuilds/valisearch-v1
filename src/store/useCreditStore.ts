import { create } from "zustand";

interface CreditState {
  credits: number;
  maxCredits: number;
  isAdmin: boolean;
  showUpgradeModal: boolean;

  deductCredit: () => boolean;
  setShowUpgradeModal: (v: boolean) => void;
  hasCredits: () => boolean;
}

const INITIAL_CREDITS = 15;
const MAX_CREDITS = 50;

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: INITIAL_CREDITS,
  maxCredits: MAX_CREDITS,
  isAdmin: false,
  showUpgradeModal: false,

  hasCredits: () => get().credits > 0,

  deductCredit: () => {
    const { credits } = get();
    if (credits <= 0) {
      set({ showUpgradeModal: true });
      return false;
    }
    set({ credits: credits - 1 });
    return true;
  },

  setShowUpgradeModal: (showUpgradeModal) => set({ showUpgradeModal }),
}));
