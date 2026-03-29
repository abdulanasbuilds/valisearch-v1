import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Download, ChevronDown, FileText, Braces, FileCode, FileImage } from "lucide-react";
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
import { KanbanSection } from "@/components/dashboard/sections/KanbanSection";
import { TechStackSection } from "@/components/dashboard/sections/TechStackSection";
import { UserFlowSection } from "@/components/dashboard/sections/UserFlowSection";
import { BuildModeSection } from "@/components/dashboard/sections/BuildModeSection";
import { IdeaEvolutionSection } from "@/components/dashboard/sections/IdeaEvolutionSection";
import { FlowEditorSection } from "@/components/dashboard/sections/FlowEditorSection";
import { MarketFeasibilitySection } from "@/components/dashboard/sections/MarketFeasibilitySection";
import { RevenueIntelligenceSection } from "@/components/dashboard/sections/RevenueIntelligenceSection";
import { IdeBridgeSection } from "@/components/dashboard/sections/IdeBridgeSection";
import { ApiSettings } from "@/components/dashboard/ApiSettings";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { downloadReport, downloadReportJson, downloadReportMarkdown, downloadReportPdf } from "@/utils/exportPdf";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { useCreditStore } from "@/store/useCreditStore";
import { getMockAnalysis } from "@/services/analysis.service";

function ExportMenu({ onExport }: { onExport: (format: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[12px] gap-1.5 border-border/60 rounded-r-none border-r-0"
          onClick={() => onExport("txt")}
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 border-border/60 rounded-l-none"
          onClick={() => setOpen(!open)}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
      {open && (
        <div
          className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-white/[0.09] bg-[#111] shadow-xl overflow-hidden"
          onMouseLeave={() => setOpen(false)}
        >
          {[
            { label: "Text report (.txt)", icon: FileText,   format: "txt" },
            { label: "JSON data (.json)",  icon: Braces,     format: "json" },
            { label: "Markdown (.md)",     icon: FileCode,   format: "md" },
            { label: "PDF report",         icon: FileImage,  format: "pdf" },
          ].map(({ label, icon: Icon, format }) => (
            <button
              key={format}
              onClick={() => { onExport(format); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] text-white/55 hover:text-white/85 hover:bg-white/[0.06] transition-colors"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { analysis, idea, setAnalysis, dataSource } = useAnalysisStore();

  useEffect(() => {
    if (!analysis) {
      setAnalysis(getMockAnalysis(idea || "AI-powered productivity tool"));
    }
  }, [analysis, idea, setAnalysis]);

  if (!analysis) return null;

  const handleExport = (format: string) => {
    if (format === "json") return downloadReportJson(analysis);
    if (format === "md")   return downloadReportMarkdown(analysis);
    if (format === "pdf")  return downloadReportPdf(analysis);
    return downloadReport(analysis);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between gap-3 border-b border-border/40 px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="text-[13px] font-medium text-muted-foreground">
                Startup Analysis
              </span>
              {dataSource && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                  dataSource === "ai"
                    ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
                    : "bg-accent text-muted-foreground"
                }`}>
                  {dataSource === "ai" ? "✦ AI-powered" : "Demo data"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[12px] text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/")}
              >
                + New analysis
              </Button>
              <ExportMenu onExport={handleExport} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route index                    element={<Navigate to="overview" replace />} />
              <Route path="overview"          element={<OverviewSection />} />
              <Route path="validation"        element={<ValidationSection />} />
              <Route path="market-feasibility" element={<MarketFeasibilitySection />} />
              <Route path="market"            element={<MarketSection />} />
              <Route path="competitors"       element={<CompetitorsSection />} />
              <Route path="product"           element={<ProductSection />} />
              <Route path="branding"          element={<BrandingSection />} />
              <Route path="revenue"           element={<RevenueIntelligenceSection />} />
              <Route path="monetization"      element={<MonetizationSection />} />
              <Route path="go-to-market"      element={<GoToMarketSection />} />
              <Route path="evolution"         element={<IdeaEvolutionSection />} />
              <Route path="flow-editor"       element={<FlowEditorSection />} />
              <Route path="flow"              element={<UserFlowSection />} />
              <Route path="kanban"            element={<KanbanSection />} />
              <Route path="tech-stack"        element={<TechStackSection />} />
              <Route path="build-mode"        element={<BuildModeSection />} />
              <Route path="ide-bridge"        element={<IdeBridgeSection />} />
              <Route path="settings"          element={<ApiSettings />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
