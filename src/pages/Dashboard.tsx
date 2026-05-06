import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Download, ChevronDown, FileText, Braces, FileCode, FileImage } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
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
import { LaunchCenterSection } from "@/components/dashboard/sections/LaunchCenterSection";
import { MarketIntelligenceSection } from "@/components/dashboard/sections/MarketIntelligenceSection";
import { ProblemLandscapeSection } from "@/components/dashboard/sections/ProblemLandscapeSection";
import { OfferBuilderSection } from "@/components/dashboard/sections/OfferBuilderSection";
import { CompetitiveIntelligenceSection } from "@/components/dashboard/sections/CompetitiveIntelligenceSection";
import { GrowthPlaybookSection } from "@/components/dashboard/sections/GrowthPlaybookSection";
import { ContentEngineSection } from "@/components/dashboard/sections/ContentEngineSection";
import { ScaleRoadmapSection } from "@/components/dashboard/sections/ScaleRoadmapSection";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { downloadReport, downloadReportJson, downloadReportMarkdown, downloadReportPdf, downloadReportDocx } from "@/utils/exportPdf";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { useCreditStore } from "@/store/useCreditStore";
import { getMockAnalysis } from "@/services/analysis.service";
import { normalizeAnalysis } from "@/lib/analysis-normalizer";
import { toast } from "sonner";

import { getSupabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";

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
          className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-white/[0.09] bg-[#111] shadow-xl overflow-hidden"
          onMouseLeave={() => setOpen(false)}
        >
          {[
            { label: "Text report (.txt)", icon: FileText,   format: "txt" },
            { label: "JSON data (.json)",  icon: Braces,     format: "json" },
            { label: "Markdown (.md)",     icon: FileCode,   format: "md" },
            { label: "Word Doc (.docx)",   icon: FileText,   format: "docx" },
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
  const { showUpgradeModal, setShowUpgradeModal, isAdmin } = useCreditStore();
  const { user, profile } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [profile, navigate]);

  useEffect(() => {
    async function loadAnalysis() {
      if (analysis) {
        setLoading(false);
        return;
      }
      
      const supabase = getSupabase();
      if (supabase && user) {
        const { data, error } = await supabase
          .from('analysis')
          .select('result_json, data_source, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (data && data.result_json) {
          setAnalysis(normalizeAnalysis(data.result_json, idea || "AI-powered productivity tool") as any);
          useAnalysisStore.setState({ dataSource: data.data_source as any });
        } else {
          setAnalysis(getMockAnalysis(idea || "AI-powered productivity tool"));
          useAnalysisStore.setState({ dataSource: 'mock' });
        }
      } else {
        setAnalysis(getMockAnalysis(idea || "AI-powered productivity tool"));
        useAnalysisStore.setState({ dataSource: 'mock' });
      }
      setLoading(false);
    }
    
    loadAnalysis();
  }, [analysis, idea, setAnalysis, user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === 'true') {
      toast.success("Welcome! Your account has been upgraded successfully.");
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const handleExport = (format: string) => {
    // If this is a V2 analysis without the legacy idea_analysis field
    if (analysis && !("idea_analysis" in analysis)) {
        if (format === "json") {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", "valisearch_analysis.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            return;
        }
        toast.error(`Export to ${format.toUpperCase()} is not yet fully supported for V2 analyses.`);
        return;
    }
    
    // Legacy export
    if (format === "json") return downloadReportJson(analysis as import("@/types/analysis").ValiSearchAnalysis);
    if (format === "md")   return downloadReportMarkdown(analysis as import("@/types/analysis").ValiSearchAnalysis);
    if (format === "pdf")  return downloadReportPdf(analysis as import("@/types/analysis").ValiSearchAnalysis);
    if (format === "docx") return downloadReportDocx(analysis as import("@/types/analysis").ValiSearchAnalysis);
    return downloadReport(analysis as import("@/types/analysis").ValiSearchAnalysis);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          {dataSource && (
            <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider shrink-0 ${
              dataSource === "ai"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-white/5 text-zinc-400 border border-white/10"
            }`}>
              {dataSource === "ai" ? "✦ AI" : "Demo"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[12px] text-muted-foreground hover:text-foreground flex-1 sm:flex-none"
            onClick={() => navigate("/workspace")}
          >
            + New analysis
          </Button>
          <ExportMenu onExport={handleExport} />
        </div>
      </div>

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
        <Route path="launch-center"     element={<LaunchCenterSection />} />
        <Route path="market-intelligence" element={<MarketIntelligenceSection />} />
        <Route path="problem-landscape"   element={<ProblemLandscapeSection />} />
        <Route path="offer-builder"        element={<OfferBuilderSection />} />
        <Route path="competitive-intel"    element={<CompetitiveIntelligenceSection />} />
        <Route path="growth-playbook"      element={<GrowthPlaybookSection />} />
        <Route path="content-engine"       element={<ContentEngineSection />} />
        <Route path="scale-roadmap"        element={<ScaleRoadmapSection />} />
        <Route path="settings" element={<Navigate to="/dashboard/overview" replace />} />
      </Routes>
      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </DashboardLayout>
  );
}
