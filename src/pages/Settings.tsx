import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import { WorkspaceNavbar } from "@/components/workspace/WorkspaceNavbar";
import { toast } from "sonner";
import { Loader2, User, Lock, CreditCard, LogOut, Trash2, ArrowLeft } from "lucide-react";

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
        .select("display_name, plan")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) {
        setDisplayName(profile.display_name ?? "");
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
      .upsert({ id: user.id, display_name: displayName }, { onConflict: "id" });
    setSavingProfile(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
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
      toast.success("Password updated");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <WorkspaceNavbar credits={credits} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <button
          onClick={() => navigate("/workspace")}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to workspace
        </button>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-sm text-zinc-500">Manage your account, plan and security.</p>
        </header>

        {/* Profile */}
        <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold">Profile</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
              <input
                value={user?.email ?? ""}
                disabled
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Display name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 60))}
                placeholder="Your name"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="px-4 py-2 bg-zinc-100 text-zinc-900 text-sm font-semibold rounded-lg hover:bg-white transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save changes
          </button>
        </section>

        {/* Plan */}
        <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold">Plan & Credits</h2>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-zinc-400 mb-1">
                Current plan: <span className="text-white font-semibold capitalize">{plan}</span>
              </p>
              <p className="text-sm text-zinc-500">
                <span className="text-white font-semibold">{credits}</span> credits remaining
              </p>
            </div>
            <button
              onClick={() => navigate("/workspace?upgrade=true")}
              className="px-4 py-2 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Upgrade plan
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold">Security</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={updatePassword}
            disabled={savingPassword || !newPassword}
            className="px-4 py-2 bg-zinc-100 text-zinc-900 text-sm font-semibold rounded-lg hover:bg-white transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Update password
          </button>
        </section>

        {/* Danger / session */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          <h2 className="text-base font-semibold mb-5">Session</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
            <button
              onClick={() => toast.message("Email support@valisearch.app to delete your account.")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
