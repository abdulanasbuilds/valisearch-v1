import { create } from "zustand";
import { getUserCredits, deductCredit as dbDeductCredit } from "@/services/database.service";
import { useUserStore } from "@/store/useUserStore";

interface CreditState {
  credits: number;
  maxCredits: number;
  isAdmin: boolean;
  showUpgradeModal: boolean;

  deductCredit: () => boolean;
  setShowUpgradeModal: (v: boolean) => void;
  hasCredits: () => boolean;
  loadCreditsFromDB: () => Promise<void>;
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

    // Also deduct from DB asynchronously
    const user = useUserStore.getState().user;
    if (user) {
      dbDeductCredit(user.id).catch(console.warn);
    }

    return true;
  },

  setShowUpgradeModal: (showUpgradeModal) => set({ showUpgradeModal }),

  loadCreditsFromDB: async () => {
    const user = useUserStore.getState().user;
    if (!user) return;
    try {
      const balance = await getUserCredits(user.id);
      set({ credits: balance });
    } catch (e) {
      console.warn("[credits] Failed to load from DB:", e);
    }
  },
}));
