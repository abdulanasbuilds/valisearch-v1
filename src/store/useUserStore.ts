import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: string;
  onboarding_completed: boolean;
}

interface UserState {
  user: User | null;
  session: Session | null;
  profile: ProfileData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

let authListenerRegistered = false;

async function fetchProfile(userId: string): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, plan, onboarding_completed")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data as ProfileData | null;
  } catch (e) {
    console.warn("fetchProfile failed", e);
    return null;
  }
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  initialized: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) =>
    set({ session, user: session?.user ?? null, isAuthenticated: !!session?.user }),

  refreshProfile: async () => {
    const u = get().user;
    if (!u) return;
    const profile = await fetchProfile(u.id);
    set({ profile });
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error", error);
    } finally {
      set({ user: null, session: null, profile: null, isAuthenticated: false });
    }
  },

  initialize: async () => {
    if (get().initialized) return;
    set({ isLoading: true });

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      const profile = session?.user ? await fetchProfile(session.user.id) : null;

      set({
        session,
        user: session?.user ?? null,
        profile,
        isAuthenticated: !!session?.user,
      });

      if (!authListenerRegistered) {
        authListenerRegistered = true;
        supabase.auth.onAuthStateChange(async (_event, newSession) => {
          set({
            session: newSession,
            user: newSession?.user ?? null,
            isAuthenticated: !!newSession?.user,
          });
          // Defer profile fetch to avoid blocking the auth callback
          if (newSession?.user) {
            setTimeout(async () => {
              const p = await fetchProfile(newSession.user.id);
              set({ profile: p });
            }, 0);
          } else {
            set({ profile: null });
          }
        });
      }
    } catch (e) {
      console.error("Auth initialization error:", e);
      set({ session: null, user: null, profile: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false, initialized: true });
    }
  },
}));
