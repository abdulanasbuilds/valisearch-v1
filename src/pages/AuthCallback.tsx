import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAnalysisStore } from "@/store/useAnalysisStore";

/**
 * Handles Supabase auth callback (email confirmation, OAuth redirect).
 * Redirects to /dashboard on success, /login on failure.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const runAnalysis = useAnalysisStore((s) => s.runAnalysis);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      navigate("/login");
      return;
    }

    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        toast.success("Email confirmed! Welcome to ValiSearch.");
        
        const pendingIdea = sessionStorage.getItem("pending-idea");
        
        if (pendingIdea) {
          sessionStorage.removeItem("pending-idea");
          navigate("/analyze", { replace: true });
          runAnalysis(pendingIdea);
        } else {
          // Ideally check onboarding status, defaulting to onboarding
          navigate("/onboarding", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, runAnalysis]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/40 mx-auto mb-4" />
        <p className="text-sm text-white/40">Confirming your account...</p>
      </div>
    </div>
  );
}