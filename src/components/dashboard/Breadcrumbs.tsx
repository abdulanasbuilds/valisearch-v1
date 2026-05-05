import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  workspace: "Workspace",
  dashboard: "Dashboard",
  settings: "Settings",
  overview: "Overview",
  "market-intelligence": "Market Intelligence",
  "problem-landscape": "Problem Landscape",
  "offer-builder": "Offer Builder",
  "growth-playbook": "Growth Playbook",
  "content-engine": "Content Engine",
  "competitive-intel": "Competitive Intel",
  "scale-roadmap": "Scale Roadmap",
  evolution: "Idea Evolution",
  "flow-editor": "Flow Editor",
  kanban: "Kanban",
  validation: "Validation",
  market: "Market",
  competitors: "Competitors",
  product: "Product",
  branding: "Branding",
  monetization: "Monetization",
  "go-to-market": "Go to Market",
  "tech-stack": "Tech Stack",
  flow: "User Flow",
  "build-mode": "Build Mode",
  "ide-bridge": "IDE Bridge",
  "launch-center": "Launch Center",
  revenue: "Revenue",
  "market-feasibility": "Market Feasibility",
};

function pretty(seg: string) {
  if (LABELS[seg]) return LABELS[seg];
  // UUIDs (workspace/:id) → "Analysis"
  if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(seg)) return "Analysis";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segs = pathname.split("/").filter(Boolean);

  if (segs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-zinc-500 min-w-0">
      <Link to="/workspace" className="flex items-center hover:text-white transition-colors shrink-0">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segs.map((seg, i) => {
        const href = "/" + segs.slice(0, i + 1).join("/");
        const isLast = i === segs.length - 1;
        return (
          <span key={href} className="flex items-center gap-1 min-w-0">
            <ChevronRight className="w-3 h-3 shrink-0 text-zinc-700" />
            {isLast ? (
              <span className="font-semibold text-white truncate">{pretty(seg)}</span>
            ) : (
              <Link to={href} className="hover:text-white transition-colors truncate">
                {pretty(seg)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
