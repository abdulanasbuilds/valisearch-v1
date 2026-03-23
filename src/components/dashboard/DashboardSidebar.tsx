import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShieldCheck, BarChart3, Swords, Layers, Palette,
  DollarSign, Rocket, GitBranch, Cpu, Map, Terminal, Lightbulb, Settings
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter
} from "@/components/ui/sidebar";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { hasAnyApiKey } from "@/services/api";

const MAIN_SECTIONS = [
  { title: "Overview",       icon: LayoutDashboard, path: "overview" },
  { title: "Validation",     icon: ShieldCheck,     path: "validation" },
  { title: "Market",         icon: BarChart3,        path: "market" },
  { title: "Competitors",    icon: Swords,           path: "competitors" },
  { title: "Product",        icon: Layers,           path: "product" },
  { title: "Branding",       icon: Palette,          path: "branding" },
  { title: "Monetization",   icon: DollarSign,       path: "monetization" },
  { title: "Go-To-Market",   icon: Rocket,           path: "go-to-market" },
];

const ADVANCED_SECTIONS = [
  { title: "Idea Evolution",  icon: Lightbulb,       path: "evolution" },
  { title: "User Flow",       icon: Map,             path: "flow" },
  { title: "Kanban Board",    icon: GitBranch,       path: "kanban" },
  { title: "Tech Stack",      icon: Cpu,             path: "tech-stack" },
  { title: "Build Mode",      icon: Terminal,        path: "build-mode" },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { credits, idea } = useAnalysisStore();
  const hasKey = hasAnyApiKey();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 border-b border-border/40">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-white">
            <span className="text-[10px] font-black text-black leading-none tracking-tight">VS</span>
          </div>
          <span className="text-[13px] font-semibold">ValiSearch</span>
        </button>
        {idea && (
          <p className="mt-2 text-[11px] text-muted-foreground/60 leading-snug line-clamp-2">
            "{idea.slice(0, 60)}{idea.length > 60 ? "…" : ""}"
          </p>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-2">
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40">
              Analysis
            </span>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_SECTIONS.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(`/dashboard/${item.path}`)}
                    className={isActive(item.path) ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-[13px]">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="px-3 py-2 mt-2">
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40">
              Build
            </span>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADVANCED_SECTIONS.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(`/dashboard/${item.path}`)}
                    className={isActive(item.path) ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-[13px]">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-3 border-t border-border/40">
        {!hasKey && (
          <div className="mb-3 rounded-lg border border-white/[0.07] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-white/50">Free credits</span>
              <span className="text-[11px] font-mono font-bold text-white/70">{credits}/3</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full bg-white/40 transition-all"
                style={{ width: `${(credits / 3) * 100}%` }}
              />
            </div>
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="mt-2 w-full text-[10.5px] text-indigo-400 hover:text-indigo-300 transition-colors text-center"
            >
              Add API key →
            </button>
          </div>
        )}
        {hasKey && (
          <div className="mb-3 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2">
            <div className="text-[11px] font-medium text-green-400">✓ API key connected</div>
            <div className="text-[10.5px] text-muted-foreground/50">Unlimited analyses</div>
          </div>
        )}
        <SidebarMenuButton
          onClick={() => navigate("/dashboard/settings")}
          className="text-muted-foreground hover:text-foreground w-full"
        >
          <Settings className="h-4 w-4" />
          <span className="text-[13px]">API Settings</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
