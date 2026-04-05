import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = authData.user.id;

    // Parse request
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Idea must be at least 10 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check credits
    const { data: credit } = await supabase
      .from("credits")
      .select("id, balance")
      .eq("user_id", userId)
      .single();

    if (!credit || credit.balance <= 0) {
      return new Response(JSON.stringify({ error: "No credits remaining" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try AI providers in order
    let result = null;
    let source = "mock";
    const errors: string[] = [];

    // OpenRouter
    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!result && openrouterKey) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": Deno.env.get("APP_URL") || "https://valisearch.app",
            "X-Title": "ValiSearch",
          },
          body: JSON.stringify({
            model: Deno.env.get("OPENROUTER_MODEL") || "google/gemma-2-9b-it:free",
            max_tokens: 8192,
            temperature: 0.35,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: getSystemPrompt() },
              { role: "user", content: `Analyze this startup idea:\n\n${idea.trim()}` },
            ],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const raw = data.choices?.[0]?.message?.content;
          if (raw) {
            result = JSON.parse(raw);
            source = "ai";
          }
        }
      } catch (e) {
        errors.push(`OpenRouter: ${e.message}`);
      }
    }

    // Groq
    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!result && groqKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: Deno.env.get("GROQ_MODEL") || "llama-3.1-8b-instant",
            max_tokens: 8192,
            temperature: 0.35,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: getSystemPrompt() },
              { role: "user", content: `Analyze this startup idea:\n\n${idea.trim()}` },
            ],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const raw = data.choices?.[0]?.message?.content;
          if (raw) {
            result = JSON.parse(raw);
            source = "ai";
          }
        }
      } catch (e) {
        errors.push(`Groq: ${e.message}`);
      }
    }

    // Gemini
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!result && geminiKey) {
      try {
        const model = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${getSystemPrompt()}\n\nAnalyze this startup idea:\n\n${idea.trim()}` }] }],
              generationConfig: { maxOutputTokens: 8192, temperature: 0.35, responseMimeType: "application/json" },
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            result = JSON.parse(raw);
            source = "ai";
          }
        }
      } catch (e) {
        errors.push(`Gemini: ${e.message}`);
      }
    }

    // Mock fallback
    if (!result) {
      result = getMockResult(idea.trim());
      source = "mock";
    }

    // Save idea
    const { data: ideaRow } = await supabase
      .from("ideas")
      .insert({ user_id: userId, idea_text: idea.trim(), title: idea.trim().slice(0, 120) })
      .select("id")
      .single();

    // Save analysis
    if (ideaRow) {
      await supabase.from("analysis").insert({
        idea_id: ideaRow.id,
        user_id: userId,
        result_json: result,
        data_source: source,
      });
    }

    // Deduct credit
    await supabase
      .from("credits")
      .update({ balance: credit.balance - 1, updated_at: new Date().toISOString() })
      .eq("id", credit.id);

    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -1,
      reason: "analyze",
    });

    return new Response(JSON.stringify({ result, source, errors: errors.length ? errors : undefined }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getSystemPrompt(): string {
  return `You are ValiSearch, an expert startup analyst. Analyze the given startup idea and return a comprehensive JSON analysis with these sections: idea_analysis, validation, market_research, competitor_analysis, product_strategy, branding, monetization, go_to_market, final_verdict, scoring, idea_evolution, tech_stack, user_flow, kanban, build_mode. Return valid JSON only.`;
}

function getMockResult(idea: string) {
  return {
    idea_analysis: { summary: `Analysis of: ${idea.slice(0, 80)}`, one_liner: idea.slice(0, 120) },
    final_verdict: { score: 72, verdict: "Moderate", quick_summary: "Compelling concept with execution risks." },
    // Minimal mock — full mock is handled client-side
  };
}
