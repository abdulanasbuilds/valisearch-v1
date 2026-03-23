import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";

export function BrandingSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { branding } = analysis;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Branding</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Name suggestions, tagline, and brand positioning</p>
      </div>

      <SectionCard title="Name Suggestions">
        <div className="flex flex-wrap gap-2">
          {branding.name_suggestions.map((n) => (
            <span key={n} className="rounded-lg border border-border/60 bg-accent px-3 py-1.5 text-[13px] font-medium">
              {n}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Taglines">
        <div className="space-y-2">
          {branding.taglines.map((t) => (
            <p key={t} className="text-[15px] font-medium italic text-foreground/80">"{t}"</p>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Brand Positioning">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{branding.brand_positioning}</p>
      </SectionCard>
    </div>
  );
}
