import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

/**
 * Handles Supabase auth callback (email confirmation, OAuth redirect).
 * Redirects to /dashboard on success, /login on failure.
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      navigate("/login");
      return;
    }

    // Supabase auto-processes the URL hash tokens via detectSessionInUrl
    // Just wait briefly then check session
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/40 mx-auto mb-4" />
        <p className="text-sm text-white/40">Confirming your account…</p>
      </div>
    </div>
  );
}
