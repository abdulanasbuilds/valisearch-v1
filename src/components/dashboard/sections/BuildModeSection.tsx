import { useState } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { Copy, Check, Download } from "lucide-react";

function CodeBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl border border-white/[0.07] bg-[#0d0d0d] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.07]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.07]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.07]" />
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-[12px] leading-[1.7] text-white/55 overflow-x-auto font-mono whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}

function PromptCard({
  tool,
  logo,
  prompt,
}: {
  tool: string;
  logo: string;
  prompt: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-white/[0.03] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{logo}</span>
          <span className="text-[13px] font-semibold text-white/75">{tool}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-1"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <span className="text-white/20 text-[12px]">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-white/[0.05] p-4">
          <p className="text-[12.5px] leading-[1.7] text-white/45 font-mono whitespace-pre-wrap">{prompt}</p>
        </div>
      )}
    </div>
  );
}

export function BuildModeSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { build_mode, product_strategy, tech_stack } = analysis;

  const idea = useAnalysisStore((s) => s.idea);
  const mvpFeatures = product_strategy.mvp_features.join("\n- ");
  const stack = `Frontend: ${tech_stack.mvp.frontend}\nBackend: ${tech_stack.mvp.backend}\nDatabase: ${tech_stack.mvp.database}`;

  const lovablePrompt = `Build a SaaS application for: ${idea}\n\nMVP Features:\n- ${mvpFeatures}\n\nTech Stack:\n${stack}\n\n${build_mode.notes_for_ai_coding_tools}`;
  const cursorPrompt = `# Project: ${idea}\n\n## Architecture\n${build_mode.project_structure}\n\n## Folder Structure\n${build_mode.suggested_folder_structure}\n\n## Modules\n${build_mode.modules.join(", ")}\n\n## Notes\n${build_mode.notes_for_ai_coding_tools}`;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Build Mode</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Project structure, folder layout, and AI coding tool prompts
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Project Structure">
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
            {build_mode.project_structure}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {build_mode.modules.map((m) => (
              <span key={m} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07] text-white/50">
                {m}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notes for AI Tools">
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {build_mode.notes_for_ai_coding_tools}
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Suggested Folder Structure">
        <CodeBlock content={build_mode.suggested_folder_structure} />
      </SectionCard>

      <div>
        <h3 className="text-[14px] font-semibold mb-3">No-Code &amp; AI Builder Prompts</h3>
        <p className="text-[12px] text-muted-foreground mb-4">
          Ready-to-use prompts for popular AI coding tools. Click to expand, then copy.
        </p>
        <div className="space-y-2">
          <PromptCard tool="Lovable / Bolt.new" logo="⚡" prompt={lovablePrompt} />
          <PromptCard tool="Cursor / VS Code Copilot" logo="🖱️" prompt={cursorPrompt} />
          <PromptCard
            tool="v0 by Vercel"
            logo="▲"
            prompt={`Create a modern SaaS UI for: ${idea}\n\nKey pages: Landing, Dashboard, Settings\nDesign: Dark premium, Inter font, subtle grid background, minimal\nFeatures visible: ${product_strategy.mvp_features.slice(0, 3).join(", ")}`}
          />
        </div>
      </div>
    </div>
  );
}
