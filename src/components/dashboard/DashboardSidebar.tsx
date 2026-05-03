"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Search, 
  Library, 
  Settings, 
  LogOut, 
  Zap, 
  CreditCard,
  Plus,
  MessageSquare,
  FileText
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useUserStore();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { name: "Workspace", icon: LayoutDashboard, href: "/workspace" },
    { name: "My Ideas", icon: FileText, href: "/workspace#ideas" },
    { name: "Library", icon: Library, href: "/workspace#library" },
    { name: "Community", icon: MessageSquare, href: "/blog" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-[#0A0A0A] border-r border-white/[0.05] flex flex-col fixed left-0 top-0 z-[50]">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-white rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
            <div className="relative w-3.5 h-3.5 bg-black rounded-sm rotate-45" />
          </div>
          <span className="text-[15px] font-black tracking-tighter text-white uppercase">
            VALISEARCH
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-3 mb-4 mt-2">
          Platform
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive(item.href)
                ? "bg-white/10 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-white" : "text-zinc-500"}`} />
            {item.name}
          </Link>
        ))}

        <div className="pt-8">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-3 mb-4">
            Preferences
          </div>
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive("/settings")
                ? "bg-white/10 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className={`w-4 h-4 ${isActive("/settings") ? "text-white" : "text-zinc-500"}`} />
            Account Settings
          </Link>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/[0.05]">
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/[0.05]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-sm font-bold text-white border border-white/10">
              {user?.email?.[0].toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">Free Plan</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
