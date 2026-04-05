import { create } from "zustand";
import { getSupabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) =>
    set({ session, user: session?.user ?? null, isAuthenticated: !!session }),

  signOut: async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null, isAuthenticated: false });
  },

  initialize: async () => {
    const supabase = getSupabase();
    if (!supabase) {
      // No Supabase configured — skip auth, allow app to work in demo mode
      set({ isLoading: false });
      return;
    }

    // Set up auth state listener BEFORE getting session
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      });
    });

    // Check existing session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      isLoading: false,
    });
  },
}));
