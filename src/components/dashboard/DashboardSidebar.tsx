import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShieldCheck, BarChart3, Swords, Layers, Palette,
  DollarSign, Rocket, GitBranch, Cpu, Map, Terminal, Lightbulb, Settings,
  TrendingUp, Activity, Code2, Pencil, Zap,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter
} from "@/components/ui/sidebar";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { useCreditStore } from "@/store/useCreditStore";
import { Progress } from "@/components/ui/progress";
import logoImg from "@/assets/logo.png";

const MAIN_SECTIONS = [
  { title: "Overview",            icon: LayoutDashboard, path: "overview" },
  { title: "Validation",          icon: ShieldCheck,     path: "validation" },
  { title: "Market Feasibility",  icon: Activity,        path: "market-feasibility" },
  { title: "Market Research",     icon: BarChart3,        path: "market" },
  { title: "Competitors",         icon: Swords,           path: "competitors" },
  { title: "Product",             icon: Layers,           path: "product" },
  { title: "Branding",            icon: Palette,          path: "branding" },
  { title: "Revenue Intelligence",icon: TrendingUp,       path: "revenue" },
  { title: "Monetization",        icon: DollarSign,       path: "monetization" },
  { title: "Go-To-Market",        icon: Rocket,           path: "go-to-market" },
];

const BUILD_SECTIONS = [
  { title: "Idea Evolution",  icon: Lightbulb,  path: "evolution" },
  { title: "Flow Editor",     icon: Pencil,     path: "flow-editor" },
  { title: "User Flow",       icon: Map,        path: "flow" },
  { title: "Sprint Planner",  icon: GitBranch,  path: "kanban" },
  { title: "Tech Stack",      icon: Cpu,        path: "tech-stack" },
  { title: "Build Mode",      icon: Terminal,   path: "build-mode" },
  { title: "IDE Bridge",      icon: Code2,      path: "ide-bridge" },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idea } = useAnalysisStore();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 border-b border-border/40">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <img src={logoImg} alt="ValiSearch" className="h-6 w-auto" />
          <span className="text-[13px] font-semibold">ValiSearch</span>
        </button>
        {idea && (
          <p className="mt-2 text-[11px] text-muted-foreground/60 leading-snug line-clamp-2">
            "{idea.slice(0, 60)}{idea.length > 60 ? "…" : ""}"
          </p>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Analysis group */}
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

        {/* Build group */}
        <SidebarGroup>
          <div className="px-3 py-2 mt-2">
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40">
              Build
            </span>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {BUILD_SECTIONS.map((item) => (
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

      <SidebarFooter className="px-4 py-3 border-t border-border/40 space-y-3">
        {/* Credit display */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary" />
              Credits
            </span>
            <span className="text-[11px] font-semibold text-foreground/80">
              {credits} / {maxCredits}
            </span>
          </div>
          <Progress value={(credits / maxCredits) * 100} className="h-1.5" />
        </div>

        {/* Admin-only settings link */}
        {isAdmin && (
          <SidebarMenuButton
            onClick={() => navigate("/dashboard/settings")}
            className="text-muted-foreground hover:text-foreground w-full"
          >
            <Settings className="h-4 w-4" />
            <span className="text-[13px]">API Settings</span>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
