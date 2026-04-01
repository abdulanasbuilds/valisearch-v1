import { useMemo } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import {
  Lightbulb, ShoppingCart, BookOpen, Heart, Shield, Zap, Globe, Brain,
  Camera, Music, Gamepad2, Briefcase, Truck, Home, Utensils, Dumbbell,
  GraduationCap, Stethoscope, BarChart3, Users, Rocket, Code2, Palette,
  Megaphone, type LucideIcon,
} from "lucide-react";

/* ─── Icon matcher — picks 3 icons based on industry keywords ─── */
const ICON_MAP: [string[], LucideIcon][] = [
  [["health", "medical", "wellness", "fitness", "gym"], Stethoscope],
  [["edu", "learn", "school", "course", "teach"], GraduationCap],
  [["shop", "ecommerce", "store", "retail", "buy"], ShoppingCart],
  [["food", "restaurant", "cook", "meal", "recipe"], Utensils],
  [["travel", "trip", "hotel", "book", "flight"], Globe],
  [["finance", "money", "invest", "bank", "payment"], BarChart3],
  [["ai", "machine", "intelli", "automat", "smart"], Brain],
  [["social", "community", "connect", "network", "chat"], Users],
  [["game", "play", "entertain", "fun"], Gamepad2],
  [["photo", "video", "media", "content", "stream"], Camera],
  [["music", "audio", "podcast", "sound"], Music],
  [["sport", "exercise", "train", "workout"], Dumbbell],
  [["home", "real estate", "property", "house"], Home],
  [["delivery", "logistics", "ship", "transport"], Truck],
  [["market", "growth", "launch", "startup"], Rocket],
  [["code", "develop", "software", "saas", "app", "tool", "tech"], Code2],
  [["design", "creative", "art", "brand"], Palette],
  [["ad", "campaign", "promote", "seo"], Megaphone],
  [["security", "privacy", "protect", "safe"], Shield],
  [["love", "care", "support", "help"], Heart],
  [["idea", "innovat", "invent", "product"], Lightbulb],
  [["read", "write", "blog", "publish"], BookOpen],
  [["work", "business", "enterprise", "corporate"], Briefcase],
];

function pickIcons(text: string, count = 3): { Icon: LucideIcon; label: string }[] {
  const lower = text.toLowerCase();
  const scored = ICON_MAP.map(([keys, icon]) => ({
    icon,
    label: keys[0],
    score: keys.reduce((s, k) => s + (lower.includes(k) ? 1 : 0), 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  // Always return at least `count` icons, filling with defaults
  const defaults = [
    { icon: Lightbulb, label: "innovation", score: -1 },
    { icon: Rocket, label: "launch", score: -2 },
    { icon: Zap, label: "speed", score: -3 },
  ];
  const pool = [...scored, ...defaults];
  const seen = new Set<LucideIcon>();
  const result: { Icon: LucideIcon; label: string }[] = [];
  for (const item of pool) {
    if (seen.has(item.icon)) continue;
    seen.add(item.icon);
    result.push({ Icon: item.icon, label: item.label });
    if (result.length >= count) break;
  }
  return result;
}

export function BrandingSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  const idea = useAnalysisStore((s) => s.idea);
  if (!analysis) return null;

  const { branding } = analysis;

  const suggestedIcons = useMemo(
    () => pickIcons(`${idea} ${branding.brand_positioning} ${branding.name_suggestions.join(" ")}`),
    [idea, branding],
  );

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Branding</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Name suggestions, tagline, brand positioning &amp; icon marks</p>
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

      {/* Suggested Logo Marks */}
      <SectionCard title="Suggested Logo Marks" description="AI-selected icons based on your industry and positioning">
        <div className="flex gap-4">
          {suggestedIcons.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.07] bg-white/[0.03] min-w-[90px]">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <span className="text-[11px] text-muted-foreground capitalize">{label}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
