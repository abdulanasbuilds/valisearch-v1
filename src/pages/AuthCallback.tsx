"use client";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

/**
 * Handles the redirect from Supabase Auth (email confirmation, OAuth, etc.)
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Supabase handles the session exchange automatically if the URL contains the right fragments/queries.
      // We just need to wait for the session to be established and then redirect.
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error.message);
        navigate("/login");
        return;
      }

      if (session) {
        navigate(returnUrl);
      } else {
        // If no session yet, we might still be in the middle of a redirect or it failed.
        // We'll give it a moment or redirect back to login.
        const timeout = setTimeout(() => {
          navigate("/login");
        }, 5000);
        return () => clearTimeout(timeout);
      }
    };

    handleAuthCallback();
  }, [navigate, returnUrl]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-white mx-auto mb-6" />
        <h1 className="text-xl font-bold text-white mb-2">Authenticating...</h1>
        <p className="text-zinc-400">Please wait while we secure your session.</p>
      </div>
    </div>
  );
}