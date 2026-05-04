import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { Loader2, User, Lock, CreditCard, LogOut, Trash2, ArrowLeft, ChevronRight, UserCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useUserStore();
  const [credits, setCredits] = useState(15);
  const [plan, setPlan] = useState("free");
  const [displayName, setDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?returnUrl=/settings");
      return;
    }
    const supabase = getSupabase();
    if (!supabase || !user) return;

    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, plan")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) {
        setDisplayName(profile.full_name ?? "");
        if (profile.plan) setPlan(profile.plan);
      }
      const { data: c } = await supabase
        .from("credits")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      if (c) setCredits(c.balance);
    })();
  }, [isAuthenticated, navigate, user]);

  const saveProfile = async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: displayName })
      .eq("id", user.id);
    setSavingProfile(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated successfully!");
  };

  const updatePassword = async () => {
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    const supabase = getSupabase();
    if (!supabase) return;
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Security settings updated");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <DashboardLayout credits={credits}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">
            <UserCircle className="w-4 h-4" /> Account Center
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Workspace Settings</h1>
          <p className="text-zinc-500 font-medium">Manage your personal preferences and security configurations.</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Section */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] border border-white/[0.05] rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Public Profile</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Personal Identification</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    value={user?.email ?? ""}
                    disabled
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-zinc-600 mt-2 font-medium">Your email is managed by your identity provider.</p>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Display Name</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value.slice(0, 60))}
                    placeholder="E.g. Abdul Anas"
                    className="w-full bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                  />
                </div>

                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="px-6 py-3 bg-white text-black text-sm font-black rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Profile Changes
                </button>
              </div>
            </motion.section>

            {/* Security Section */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0A0A0A] border border-white/[0.05] rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Security & Access</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Authentication controls</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>

              <button
                onClick={updatePassword}
                disabled={savingPassword || !newPassword}
                className="px-6 py-3 bg-zinc-800 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 border border-white/10"
              >
                {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Password
              </button>
            </motion.section>
          </div>

          {/* Right Column: Billing & Danger */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-[#0A0A0A] border border-white/[0.05] rounded-3xl p-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Subscription</h3>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Active Plan</span>
                  <span className="text-[10px] font-black uppercase text-black bg-white px-2 py-0.5 rounded">Free Tier</span>
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-black tracking-tighter text-white">{credits}</span>
                  <span className="text-sm font-bold text-zinc-500 mb-1.5 uppercase">Credits</span>
                </div>
                <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
                  Resetting monthly. 15 analyses included for free.
                </p>
              </div>
              <button 
                onClick={() => navigate("/workspace?upgrade=true")}
                className="w-full py-3 bg-white text-black text-xs font-black rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <CreditCard className="w-4 h-4" /> Upgrade to Pro
              </button>
            </section>

            <section className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-6">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">Danger Zone</h3>
              
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="w-full mb-4 py-3 bg-white/5 text-zinc-300 text-xs font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>

              <p className="text-[11px] text-rose-500/70 font-medium leading-relaxed mb-6">
                Once deleted, your account and all validated intelligence data will be permanently removed.
              </p>
              <button
                onClick={() => toast.message("Request account deletion at support@valisearch.app")}
                className="w-full py-3 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-500/20 transition-all border border-rose-500/10 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
