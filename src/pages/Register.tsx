import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { requireSupabase } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/config/env";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { toast } from "sonner";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register: reg,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    if (!isSupabaseConfigured()) {
      navigate("/onboarding");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = requireSupabase();
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
          emailRedirectTo: window.location.origin + "/auth/callback",
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        setRegisteredEmail(data.email);
        setSuccess(true);
        
        // DEVELOPER ACTION REQUIRED:
        // Go to Supabase Dashboard → Authentication → 
        // Email Templates → customize your confirmation email
        // Go to Settings → Auth → SMTP Settings
        // Add your SMTP provider (Resend.com is free and easy)
        // Until SMTP is configured, emails go to Supabase's 
        // default rate-limited sender (2/hour limit)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    try {
      const supabase = requireSupabase();
      const { error } = await supabase.auth.resend({ type: 'signup', email: registeredEmail, options: { emailRedirectTo: window.location.origin + "/auth/callback" }});
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Confirmation email resent. Check your inbox.");
      }
    } catch (e) {
      toast.error("Failed to resend email.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
            <img src={logoImg} alt="ValiSearch" className="h-8 w-auto" />
            <span className="text-lg font-semibold text-white/85">ValiSearch</span>
          </Link>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-sm text-white/60 mb-6">
              We've sent a confirmation link to <span className="text-white font-medium">{registeredEmail}</span>.
              Please click the link to activate your account.
            </p>
            <p className="text-xs text-white/40 mb-8">
              Don't see it? Check your spam folder or click below to resend.
            </p>
            <button
              onClick={resendEmail}
              className="w-full mb-4 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-transparent text-white py-3 text-sm font-semibold hover:bg-white/5 transition-all"
            >
              Resend confirmation email
            </button>
            <Link to="/login" className="text-xs text-primary hover:text-primary/80 transition-colors">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <img src={logoImg} alt="ValiSearch" className="h-8 w-auto" />
          <span className="text-lg font-semibold text-white/85">ValiSearch</span>
        </Link>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-sm text-white/40 mb-8">
            Start validating startup ideas with AI intelligence.
          </p>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input
                  {...reg("fullName")}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
              {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input
                  {...reg("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input
                  {...reg("password")}
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
                  {...reg("confirmPassword")}
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
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30">
            Already have an account?{" "}
            <Link to="/login" className="text-white/60 hover:text-white/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
