import { create } from "zustand";
import { supabase } from "@/lib/supabase";
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

export const useUserStore = create<UserState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session, user: session?.user ?? null, isAuthenticated: !!session?.user }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAuthenticated: false });
  },

  initialize: async () => {
    set({ isLoading: true });

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, isAuthenticated: !!session?.user });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isAuthenticated: !!session?.user });
    });

    set({ isLoading: false });
  },
}));
