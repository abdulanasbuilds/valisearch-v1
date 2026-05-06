import { useState, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Bell, Zap, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CommandPalette, CommandPaletteTrigger } from "./CommandPalette";
import { Breadcrumbs } from "./Breadcrumbs";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  credits?: number;
  fullBleed?: boolean;
}

export function DashboardLayout({ children, credits = 0, fullBleed = false }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() =>
    typeof window !== "undefined" && localStorage.getItem("vs-sidebar-collapsed") === "1"
  );

  // Sync with sidebar's localStorage flag
  useEffect(() => {
    const onStorage = () => {
      setCollapsed(localStorage.getItem("vs-sidebar-collapsed") === "1");
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(onStorage, 400); // local same-tab sync
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  const padLeft = isMobile ? "pl-0" : collapsed ? "pl-[72px]" : "pl-64";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CommandPalette />
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main className={`${padLeft} min-h-screen transition-[padding] duration-300`}>
        {/* Top Header */}
        <header className="h-14 sm:h-16 border-b border-border/40 flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 md:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isMobile && (
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="hidden md:block min-w-0 max-w-md">
              <Breadcrumbs />
            </div>
            <div className="flex-1 min-w-0" />
            <CommandPaletteTrigger />
          </div>

          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-card/70 border border-border/60 rounded-full">
              <Zap className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground">{credits}</span>
              <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline">credits</span>
            </div>

            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Mobile breadcrumbs row */}
        {isMobile && (
          <div className="px-3 py-2 border-b border-border/40 overflow-x-auto">
            <Breadcrumbs />
          </div>
        )}

        {/* Page Content */}
        <div className={cn("w-full p-3 sm:p-4 md:p-8", fullBleed && "px-0 sm:px-0 md:px-0")}>{children}</div>
      </main>
    </div>
  );
}
