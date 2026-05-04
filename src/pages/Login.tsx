import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowRight, Apple } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 11v3.6h5.05c-.22 1.18-1.62 3.46-5.05 3.46-3.04 0-5.52-2.52-5.52-5.62S8.96 6.82 12 6.82c1.73 0 2.89.74 3.55 1.37l2.42-2.34C16.4 4.43 14.4 3.5 12 3.5 7.3 3.5 3.5 7.3 3.5 12s3.8 8.5 8.5 8.5c4.9 0 8.16-3.45 8.16-8.31 0-.56-.06-.99-.14-1.42H12z"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const returnUrl = searchParams.get("returnUrl") || "/workspace";

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      // session is automatically persisted in localStorage by Supabase + autoRefresh
      toast.success("Welcome back!");
      navigate(returnUrl, { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Failed to login with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-white rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
              <div className="relative w-3.5 h-3.5 bg-black rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">VALISEARCH</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Continue your journey from idea to startup.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin("google")}
              className="h-11 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-white rounded-xl"
            >
              <GoogleIcon />
              <span className="ml-2 text-sm">Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin("apple")}
              className="h-11 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-white rounded-xl"
            >
              <Apple className="h-4 w-4" />
              <span className="ml-2 text-sm">Apple</span>
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0A0A0A] px-4 text-zinc-500">Or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-400 ml-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  {...register("email")}
                  className="bg-white/[0.05] border-white/10 h-12 pl-12 rounded-xl text-white placeholder:text-zinc-600"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-400">Password</Label>
                <Link to="/forgot-password" className="text-xs text-zinc-500 hover:text-white">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="bg-white/[0.05] border-white/10 h-12 pl-12 rounded-xl text-white placeholder:text-zinc-600"
                />
              </div>
              {errors.password && <p className="text-xs text-destructive ml-1">{errors.password.message}</p>}
            </div>

            <label className="flex items-center gap-2 ml-1 cursor-pointer select-none">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} className="border-white/20" />
              <span className="text-xs text-zinc-400">Keep me signed in for 30 days</span>
            </label>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-white font-semibold hover:underline">Create one for free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
