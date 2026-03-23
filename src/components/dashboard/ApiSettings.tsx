import { useState } from "react";
import { SectionCard } from "./SectionCard";
import { saveApiKey, clearApiKeys, getOpenRouterKey, getGroqKey, getGeminiKey, hasAnyApiKey } from "@/services/api";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { Eye, EyeOff, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function KeyInput({
  label,
  provider,
  placeholder,
  current,
  onChange,
}: {
  label: string;
  provider: "openrouter" | "groq" | "gemini";
  placeholder: string;
  current: string | null;
  onChange: () => void;
}) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!value.trim()) return;
    saveApiKey(provider, value.trim());
    setValue("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onChange();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-white/75">{label}</label>
        {current && (
          <span className="text-[10.5px] text-green-400 flex items-center gap-1">
            <Check className="h-3 w-3" /> Connected
          </span>
        )}
      </div>
      {current && (
        <div className="text-[12px] text-muted-foreground bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 font-mono">
          {current.slice(0, 6)}{"•".repeat(20)}{current.slice(-4)}
        </div>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/[0.03] border border-white/[0.09] rounded-lg px-3 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/20 pr-9"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50"
          >
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!value.trim()}
          className="shrink-0"
        >
          {saved ? "Saved!" : "Save"}
        </Button>
      </div>
    </div>
  );
}

export function ApiSettings() {
  const refreshCredits = useAnalysisStore((s) => s.refreshCredits);
  const [refresh, setRefresh] = useState(0);

  const handleChange = () => {
    refreshCredits();
    setRefresh((r) => r + 1);
  };

  const handleClearAll = () => {
    clearApiKeys();
    handleChange();
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">API Settings</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Connect your own AI API keys for unlimited analyses. Keys are stored locally in your browser.
        </p>
      </div>

      <SectionCard title="OpenRouter (Recommended)">
        <p className="text-[12px] text-muted-foreground mb-4">
          Access 100+ models including free ones (Gemma, Mistral, Llama). Get a free key at{" "}
          <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
            openrouter.ai
          </a>
        </p>
        <KeyInput
          key={refresh}
          label="OpenRouter API Key"
          provider="openrouter"
          placeholder="sk-or-..."
          current={getOpenRouterKey()}
          onChange={handleChange}
        />
      </SectionCard>

      <SectionCard title="Groq (Fast, Free tier)">
        <p className="text-[12px] text-muted-foreground mb-4">
          Ultra-fast inference with Llama 3. Free tier available at{" "}
          <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
            console.groq.com
          </a>
        </p>
        <KeyInput
          key={`groq-${refresh}`}
          label="Groq API Key"
          provider="groq"
          placeholder="gsk_..."
          current={getGroqKey()}
          onChange={handleChange}
        />
      </SectionCard>

      <SectionCard title="Gemini (Google)">
        <p className="text-[12px] text-muted-foreground mb-4">
          Google's Gemini 1.5 Flash. Free tier available at{" "}
          <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
            aistudio.google.com
          </a>
        </p>
        <KeyInput
          key={`gemini-${refresh}`}
          label="Gemini API Key"
          provider="gemini"
          placeholder="AIza..."
          current={getGeminiKey()}
          onChange={handleChange}
        />
      </SectionCard>

      {hasAnyApiKey() && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All Keys
          </Button>
        </div>
      )}

      <SectionCard>
        <h3 className="text-[13px] font-semibold mb-2">Privacy Notice</h3>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Your API keys are stored only in your browser's localStorage and are never sent to ValiSearch servers.
          Your startup idea is sent directly from your browser to the AI provider you configured.
        </p>
      </SectionCard>
    </div>
  );
}
