import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { OverviewSection } from "@/components/dashboard/sections/OverviewSection";
import { ValidationSection } from "@/components/dashboard/sections/ValidationSection";
import { MarketSection } from "@/components/dashboard/sections/MarketSection";
import { CompetitorsSection } from "@/components/dashboard/sections/CompetitorsSection";
import { ProductSection } from "@/components/dashboard/sections/ProductSection";
import { BrandingSection } from "@/components/dashboard/sections/BrandingSection";
import { MonetizationSection } from "@/components/dashboard/sections/MonetizationSection";
import { GoToMarketSection } from "@/components/dashboard/sections/GoToMarketSection";
import { downloadReport } from "@/utils/exportPdf";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { getMockAnalysis } from "@/services/analysis.service";

export default function Dashboard() {
  const navigate = useNavigate();
  const { analysis, idea, setAnalysis, dataSource } = useAnalysisStore();

  // If no analysis exists (e.g. direct navigation), load mock data
  useEffect(() => {
    if (!analysis) {
      setAnalysis(getMockAnalysis(idea || "AI-powered productivity tool"));
    }
  }, [analysis, idea, setAnalysis]);

  if (!analysis) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between gap-3 border-b border-border/40 px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="text-[13px] font-medium text-muted-foreground">Startup Analysis</span>
              {dataSource && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  dataSource === "ai"
                    ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
                    : "bg-accent text-muted-foreground"
                }`}>
                  {dataSource === "ai" ? "AI-powered" : "Mock data"}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[12px] gap-1.5 border-border/60"
              onClick={() => downloadReport(analysis)}
            >
              <Download className="h-3.5 w-3.5" />
              Export Report
            </Button>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewSection />} />
              <Route path="validation" element={<ValidationSection />} />
              <Route path="market" element={<MarketSection />} />
              <Route path="competitors" element={<CompetitorsSection />} />
              <Route path="product" element={<ProductSection />} />
              <Route path="branding" element={<BrandingSection />} />
              <Route path="monetization" element={<MonetizationSection />} />
              <Route path="go-to-market" element={<GoToMarketSection />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
