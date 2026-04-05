import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { requireSupabase } from "@/lib/supabase";
import { Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { Link } from "react-router-dom";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Check for recovery token in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      // Not a valid recovery link — could be direct navigation
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = requireSupabase();
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <img src={logoImg} alt="ValiSearch" className="h-8 w-auto" />
          <span className="text-lg font-semibold text-white/85">ValiSearch</span>
        </Link>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-400/70 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white mb-2">Password updated</h1>
              <p className="text-sm text-white/40">Redirecting to dashboard…</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Set new password</h1>
              <p className="text-sm text-white/40 mb-8">
                Choose a strong password for your account.
              </p>

              {error && (
                <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="At least 8 characters"
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black py-3 text-sm font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Update password <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
