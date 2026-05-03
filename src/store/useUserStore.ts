import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

let authListenerRegistered = false;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  initialized: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session, user: session?.user ?? null, isAuthenticated: !!session?.user }),

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error", error);
    } finally {
      set({ user: null, session: null, isAuthenticated: false });
    }
  },

  initialize: async () => {
    // Only initialize once
    if (get().initialized) return;

    set({ isLoading: true });

    try {
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      set({ 
        session, 
        user: session?.user ?? null, 
        isAuthenticated: !!session?.user,
      });

      // Listen for auth changes, ensuring we only register once
      if (!authListenerRegistered) {
        authListenerRegistered = true;
        supabase.auth.onAuthStateChange((_event, session) => {
          // Ignore INITIAL_SESSION if we already set it to avoid race conditions
          set({ 
            session, 
            user: session?.user ?? null, 
            isAuthenticated: !!session?.user 
          });
        });
      }
    } catch (e) {
      console.error("Auth initialization error:", e);
      set({ session: null, user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false, initialized: true });
    }
  },
}));
