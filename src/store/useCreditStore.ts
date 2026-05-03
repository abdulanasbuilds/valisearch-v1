"use client";

import { create } from "zustand";
import { getUserCredits } from "@/services/database.service";
import { useUserStore } from "@/store/useUserStore";

interface CreditState {
  credits: number;
  maxCredits: number;
  isAdmin: boolean;
  showUpgradeModal: boolean;

  deductCredit: (amount?: number) => boolean;
  setShowUpgradeModal: (v: boolean) => void;
  hasCredits: (amount?: number) => boolean;
  loadCreditsFromDB: () => Promise<void>;
}

const INITIAL_CREDITS = 15;
const MAX_CREDITS = 50;

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: INITIAL_CREDITS,
  maxCredits: MAX_CREDITS,
  isAdmin: false,
  showUpgradeModal: false,

  hasCredits: (amount = 1) => get().credits >= amount,

  deductCredit: (amount = 1) => {
    const { credits } = get();
    if (credits < amount) {
      set({ showUpgradeModal: true });
      return false;
    }
    set({ credits: credits - amount });
    // Note: Actual DB deduction happens in the Edge Function (analyze / analyze-v2) 
    // to prevent double-deduction and ensure atomic transactions.
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
