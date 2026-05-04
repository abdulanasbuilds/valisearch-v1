import { useMemo } from "react";
import { useUserStore } from "@/store/useUserStore";
import { CheckCircle2, Circle, Sparkles, Target, Rocket, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ChecklistProps {
  hasAnalyzed: boolean;
  onFocusInput?: () => void;
}

export function GettingStartedChecklist({ hasAnalyzed, onFocusInput }: ChecklistProps) {
  const { user, profile } = useUserStore();
  const navigate = useNavigate();

  const items = useMemo(() => {
    const onboarded = !!profile?.onboarding_completed;
    const hasName = !!profile?.full_name && profile.full_name.trim().length > 1;
    return [
      {
        id: "signup",
        title: "Create your account",
        desc: "Welcome aboard — that's already done!",
        done: !!user,
        icon: Sparkles,
        onClick: () => {},
      },
      {
        id: "onboarding",
        title: "Tell us about you",
        desc: "Pick your role and goal so we can tailor results.",
        done: onboarded,
        icon: Target,
        onClick: () => navigate("/onboarding"),
      },
      {
        id: "first-analysis",
        title: "Run your first validation",
        desc: "Drop an idea above — get a full report in 90 seconds.",
        done: hasAnalyzed,
        icon: Rocket,
        onClick: onFocusInput,
      },
      {
        id: "profile",
        title: "Add your display name",
        desc: "Personalize your workspace.",
        done: hasName,
        icon: SettingsIcon,
        onClick: () => navigate("/settings"),
      },
    ];
  }, [user, profile, hasAnalyzed, navigate, onFocusInput]);

  const completed = items.filter((i) => i.done).length;
  const pct = (completed / items.length) * 100;

  if (completed === items.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 mb-8"
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
            Getting started
          </div>
          <h3 className="text-lg font-black tracking-tight text-white">
            {completed} of {items.length} steps complete
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-tighter text-white">{Math.round(pct)}%</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Setup</div>
        </div>
      </div>

      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-white"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <ul className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl text-left transition-all border ${
                  item.done
                    ? "border-transparent bg-white/[0.02] opacity-60"
                    : "border-white/[0.05] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold ${item.done ? "text-zinc-500 line-through" : "text-white"}`}>
                    {item.title}
                  </div>
                  <div className="text-xs text-zinc-500 truncate">{item.desc}</div>
                </div>
                <Icon className="w-4 h-4 text-zinc-600" />
              </button>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}
