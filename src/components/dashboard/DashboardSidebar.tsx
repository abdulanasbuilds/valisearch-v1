"use client";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Search,
  LogOut,
  Zap,
  Plus,
  MessageSquare,
  FileText,
  BarChart,
  LineChart,
  Users,
  Box,
  GitPullRequest,
  Workflow,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardSidebarProps {
  /** Mobile drawer state. When undefined, sidebar runs in desktop mode. */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({ mobileOpen = false, onMobileClose }: DashboardSidebarProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, signOut } = useUserStore();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("vs-sidebar-collapsed") === "1";
  });

  useEffect(() => {
    localStorage.setItem("vs-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    if (isMobile && mobileOpen) onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const base = id ? `/workspace/${id}` : "/dashboard";
  const hasAnalysisContext = !!id || location.pathname.startsWith("/dashboard");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const intelligenceItems = [
    ...(hasAnalysisContext ? [] : [{ name: "Workspace", icon: LayoutDashboard, href: "/workspace" }]),
    { name: "Overview", icon: LayoutDashboard, href: `${base}/overview` },
    { name: "Market Intelligence", icon: Search, href: `${base}/market-intelligence` },
    { name: "Problem Landscape", icon: MessageSquare, href: `${base}/problem-landscape` },
    { name: "Offer Builder", icon: Zap, href: `${base}/offer-builder` },
    { name: "Growth Playbook", icon: LineChart, href: `${base}/growth-playbook` },
    { name: "Content Engine", icon: FileText, href: `${base}/content-engine` },
    { name: "Competitive Intel", icon: Users, href: `${base}/competitive-intel` },
    { name: "Scale Roadmap", icon: BarChart, href: `${base}/scale-roadmap` },
  ];

  const buildItems = [
    { name: "Idea Evolution", icon: GitPullRequest, href: `${base}/evolution` },
    { name: "Flow Editor", icon: Workflow, href: `${base}/flow-editor` },
    { name: "Kanban Board", icon: Box, href: `${base}/kanban` },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // On mobile, sidebar becomes a slide-out drawer regardless of "collapsed".
  const showFull = isMobile ? true : !collapsed;
  const widthClass = isMobile ? "w-72" : showFull ? "w-64" : "w-[72px]";

  const translate = isMobile
    ? mobileOpen
      ? "translate-x-0"
      : "-translate-x-full"
    : "translate-x-0";

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={onMobileClose}
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
          className={`${widthClass} ${translate} h-[100dvh] bg-background border-r border-border/40 flex flex-col fixed left-0 top-0 z-[60] transition-[transform,width] duration-300 ease-out`}
      >
        {/* Logo + collapse */}
        <div className="px-4 pt-5 pb-3 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-white rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
              <div className="relative w-3.5 h-3.5 bg-black rounded-sm rotate-45" />
            </div>
            {showFull && (
              <span className="text-[15px] font-black tracking-tighter text-white uppercase truncate">
                VALISEARCH
              </span>
            )}
          </Link>
          {isMobile ? (
            <button
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* New idea CTA */}
        <div className="px-3 mb-2">
          <Link
            to="/workspace"
            className={`flex items-center gap-2 ${
              showFull ? "px-3 py-2.5 justify-start" : "p-2 justify-center"
            } rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {showFull && <span>New idea</span>}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-5">
          <NavGroup title="Intelligence" items={intelligenceItems} isActive={isActive} showFull={showFull} />
          <NavGroup title="Build" items={buildItems} isActive={isActive} showFull={showFull} />
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-white/[0.05]">
          <div
            className={`bg-zinc-900/50 rounded-2xl border border-white/[0.05] ${
              showFull ? "p-3" : "p-2"
            }`}
          >
            <div className={`flex items-center gap-3 ${showFull ? "mb-3" : "justify-center"}`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-sm font-bold text-white border border-white/10 shrink-0">
                {user?.email?.[0].toUpperCase() ?? "U"}
              </div>
              {showFull && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.email?.split("@")[0] || "User"}
                  </p>
                  <Link
                    to="/settings"
                    className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest"
                  >
                    Settings
                  </Link>
                </div>
              )}
            </div>
            {showFull ? (
              <div className="flex gap-2">
                <Link
                  to="/settings"
                  className="flex-1 flex items-center justify-center gap-2 px-2 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <Settings className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex-1 flex items-center justify-center gap-2 px-2 py-2 text-xs font-bold text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                className="w-full mt-2 flex items-center justify-center px-2 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function NavGroup({
  title,
  items,
  isActive,
  showFull,
}: {
  title: string;
  items: { name: string; icon: any; href: string }[];
  isActive: (p: string) => boolean;
  showFull: boolean;
}) {
  return (
    <div>
      {showFull && (
        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-3 mb-2">
          {title}
        </div>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              title={!showFull ? item.name : undefined}
              className={`flex items-center gap-3 ${
                showFull ? "px-3 py-2" : "p-2.5 justify-center"
              } rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : ""}`} />
              {showFull && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
