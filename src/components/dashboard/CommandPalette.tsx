import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  Zap,
  LineChart,
  FileText,
  Users,
  BarChart,
  GitPullRequest,
  Workflow,
  Box,
  Settings,
  Plus,
  LogOut,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface Cmd {
  label: string;
  icon: any;
  action: () => void;
  group: string;
  hint?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useUserStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const navCommands: Cmd[] = [
    { label: "Workspace", icon: LayoutDashboard, action: () => go("/workspace"), group: "Navigation", hint: "G W" },
    { label: "New Analysis", icon: Plus, action: () => go("/workspace"), group: "Navigation" },
    { label: "Settings", icon: Settings, action: () => go("/settings"), group: "Navigation" },
  ];

  const dashCommands: Cmd[] = [
    { label: "Overview", icon: LayoutDashboard, action: () => go("/dashboard/overview"), group: "Dashboard" },
    { label: "Market Intelligence", icon: Search, action: () => go("/dashboard/market-intelligence"), group: "Dashboard" },
    { label: "Problem Landscape", icon: MessageSquare, action: () => go("/dashboard/problem-landscape"), group: "Dashboard" },
    { label: "Offer Builder", icon: Zap, action: () => go("/dashboard/offer-builder"), group: "Dashboard" },
    { label: "Growth Playbook", icon: LineChart, action: () => go("/dashboard/growth-playbook"), group: "Dashboard" },
    { label: "Content Engine", icon: FileText, action: () => go("/dashboard/content-engine"), group: "Dashboard" },
    { label: "Competitive Intel", icon: Users, action: () => go("/dashboard/competitive-intel"), group: "Dashboard" },
    { label: "Scale Roadmap", icon: BarChart, action: () => go("/dashboard/scale-roadmap"), group: "Dashboard" },
    { label: "Idea Evolution", icon: GitPullRequest, action: () => go("/dashboard/evolution"), group: "Build" },
    { label: "Flow Editor", icon: Workflow, action: () => go("/dashboard/flow-editor"), group: "Build" },
    { label: "Kanban Board", icon: Box, action: () => go("/dashboard/kanban"), group: "Build" },
  ];

  const accountCommands: Cmd[] = [
    { label: "Upgrade plan", icon: CreditCard, action: () => go("/settings"), group: "Account" },
    { label: "Sign out", icon: LogOut, action: async () => { setOpen(false); await signOut(); navigate("/"); }, group: "Account" },
  ];

  const groups = [
    { name: "Navigation", items: navCommands },
    { name: "Dashboard", items: dashCommands.filter(c => c.group === "Dashboard") },
    { name: "Build", items: dashCommands.filter(c => c.group === "Build") },
    { name: "Account", items: accountCommands },
  ];

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, actions, or settings…" />
        <CommandList>
          <CommandEmpty>
            <div className="py-6 text-center text-sm text-muted-foreground">
              <Sparkles className="w-5 h-5 mx-auto mb-2 opacity-50" />
              No matches. Try “overview” or “settings”.
            </div>
          </CommandEmpty>
          {groups.map((g, i) => (
            <div key={g.name}>
              {i > 0 && <CommandSeparator />}
              <CommandGroup heading={g.name}>
                {g.items.map((c) => (
                  <CommandItem key={c.label} onSelect={c.action}>
                    <c.icon className="mr-2 h-4 w-4" />
                    <span>{c.label}</span>
                    {c.hint && (
                      <span className="ml-auto text-[10px] tracking-widest text-muted-foreground">
                        {c.hint}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export function CommandPaletteTrigger() {
  return (
    <button
      onClick={() => {
        const e = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
        window.dispatchEvent(e);
      }}
      className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-500 hover:text-white hover:bg-white/[0.07] transition-all text-xs font-medium w-72"
      aria-label="Open command palette"
    >
      <Search className="w-3.5 h-3.5" />
      <span>Search or jump to…</span>
      <kbd className="ml-auto flex items-center gap-0.5 text-[10px] font-mono text-zinc-600">
        <span className="px-1.5 py-0.5 bg-white/[0.05] rounded">⌘</span>
        <span className="px-1.5 py-0.5 bg-white/[0.05] rounded">K</span>
      </kbd>
    </button>
  );
}
