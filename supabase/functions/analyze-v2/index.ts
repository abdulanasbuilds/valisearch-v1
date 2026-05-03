import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ═══════════════════════════════════════════════
// PROMPT TEMPLATES
// ═══════════════════════════════════════════════

const MARKET_BREAKDOWN_PROMPT = `You are a market research analyst at a top-tier strategy firm. Analyze the market for the given startup idea.
Use only specific, data-backed insights. No generic statements. No filler.
Return a JSON object with this exact structure:
{"tam":{"value":"string","assumption":"string"},"sam":{"value":"string","assumption":"string"},"som":{"value":"string","assumption":"string"},"demand_trends":[{"headline":"string","explanation":"string"}],"underserved_opportunities":[{"gap":"string","why_underserved":"string"}],"follow_the_money":[{"area":"string","signal":"string"}]}
demand_trends must have exactly 5 items. underserved_opportunities must have exactly 5 items. follow_the_money must have 3-5 items.
Return ONLY the JSON. No markdown. No explanation.`;

const PROBLEM_PRIORITIZATION_PROMPT = `You are a product strategist who has done 500+ customer discovery interviews. Analyze the industry/space for the given startup idea.
Identify and rank the top 10 problems.
Return a JSON object with this exact structure:
{"problems":[{"rank":1,"problem":"string","urgency":8,"willingness_to_pay":9,"combined_score":17,"growth_trajectory":"rising fast","complaint_signal":true,"why_it_ranks_here":"string"}],"top_insight":"string"}
growth_trajectory must be exactly one of: "rising fast", "stable", or "declining". Sort problems by combined_score descending. problems must have exactly 10 items.
Return ONLY the JSON. No markdown. No explanation.`;

const OFFER_CREATION_PROMPT = `You are a direct response copywriter who has written offers generating $10M+ in revenue. Create a high-converting offer for the given startup idea.
Return a JSON object with this exact structure:
{"headline":"string","icp":{"who":"string","situation":"string","pain_level":"string"},"value_proposition":"string","offer_components":[{"component":"string","format":"string","value":"string"}],"pricing_tiers":[{"name":"string","price":"string","who_its_for":"string","key_difference":"string"}],"guarantee":"string","competitive_edge":["string","string","string"]}
pricing_tiers must have exactly 3 items. offer_components must have 3-5 items. competitive_edge must have exactly 3 items.
Return ONLY the JSON. No markdown. No explanation.`;

const DISTRIBUTION_PLAN_PROMPT = `You are a senior growth strategist who has taken 20+ startups from 0 to $1M ARR. Build a realistic 30-day distribution plan for the given startup idea.
Assume: solo founder, limited budget under $500/month, targeting early adopters, needs first 100 users.
Return a JSON object with this exact structure:
{"acquisition_channels":[{"rank":1,"channel":"string","why_this_audience":"string","cost_efficiency":"string","time_to_first_result":"string"}],"content_formats":[{"channel":"string","format":"string","example_title":"string","why_it_works":"string"}],"weekly_calendar":{"week_1":"string","week_2":"string","week_3":"string","week_4":"string"},"budget_split":{"organic_percentage":80,"paid_percentage":20,"rationale":"string"},"leverage_plays":[{"tactic":"string","why_it_multiplies":"string","how_to_execute":"string"}]}
acquisition_channels must have exactly 5 items. leverage_plays must have exactly 3 items.
Return ONLY the JSON. No markdown. No explanation.`;

const VIRAL_CONTENT_PROMPT = `You are a viral content strategist who has grown 10+ accounts past 100K followers from scratch. Create a viral content strategy for the given startup idea.
Return a JSON object with this exact structure:
{"hooks":[{"hook":"string","emotional_trigger":"string","why_it_works":"string"}],"content_formats":[{"format":"string","platform":"string","ideal_length":"string","why_it_spreads":"string","example_title":"string"}],"shareability_audit":[{"format":"string","what_makes_people_share":"string"}],"weekly_system":{"posts_per_week":5,"rotation":[{"day":"Monday","format":"string","purpose":"string"}],"burnout_prevention":"string"}}
hooks must have exactly 10 items. emotional_trigger must be one of: "fear_of_missing_out", "social_status", "curiosity", "controversy".
Return ONLY the JSON. No markdown. No explanation.`;

const COMPETITOR_WEAKNESS_PROMPT = `You are a competitive intelligence analyst. Identify and analyze the top 5 competitors for the given startup idea.
For each competitor, be specific about real companies if they exist in this space.
Return a JSON object with this exact structure:
{"competitors":[{"name":"string","description":"string","defensible_strength":"string","critical_weakness":"string","ignored_audience":"string","pricing_signal":"string"}],"gap_analysis":[{"white_space":"string","evidence":"string","difficulty_to_enter":"string"}],"positioning_recommendation":"string","fastest_gtm_path":{"ignored_audience":"string","best_channel":"string","why_combination_works":"string"}}
competitors must have exactly 5 items. gap_analysis must have 2-3 items. difficulty_to_enter must be "low", "medium", or "high".
Return ONLY the JSON. No markdown. No explanation.`;

const SCALE_SYSTEM_PROMPT = `You are a startup operator who has scaled 5 companies from $0 to $1M ARR. Create a phased execution roadmap for the given startup idea.
Target: reach $10,000 MRR within 12 months. Assume: solo founder, bootstrapped, working part-time, no team yet.
Return a JSON object with this exact structure:
{"target_revenue":"$10,000 MRR","timeframe":"12 months","phases":{"phase_1":{"name":"Stabilize","months":"1-2","goal":"string","actions":[{"action":"string","why":"string","tool":"string"}],"milestone":"string"},"phase_2":{"name":"Automate","months":"3-4","goal":"string","automations":[{"process":"string","tool":"string","time_saved_weekly":"string"}],"milestone":"string"},"phase_3":{"name":"Delegate","months":"5-8","goal":"string","hires":[{"role":"string","hire_when":"string","monthly_cost":"string","what_they_own":"string"}],"milestone":"string"},"phase_4":{"name":"Scale","months":"9-12","goal":"string","growth_lever":"string","growth_lever_rationale":"string","revenue_projection":"string","milestone":"string"}},"biggest_risk":"string","unfair_advantage":"string"}
Return ONLY the JSON. No markdown. No explanation.`;

const PROMPTS: Record<string, string> = {
  market_breakdown: MARKET_BREAKDOWN_PROMPT,
  problem_prioritization: PROBLEM_PRIORITIZATION_PROMPT,
  offer_creation: OFFER_CREATION_PROMPT,
  distribution_plan: DISTRIBUTION_PLAN_PROMPT,
  viral_content: VIRAL_CONTENT_PROMPT,
  competitor_weakness: COMPETITOR_WEAKNESS_PROMPT,
  scale_system: SCALE_SYSTEM_PROMPT,
};

const QUICK_FRAMEWORKS = ["market_breakdown", "problem_prioritization", "competitor_weakness"];
const ALL_FRAMEWORKS = Object.keys(PROMPTS);

// ═══════════════════════════════════════════════
// AI CALL HELPERS
// ═══════════════════════════════════════════════

async function callAI(systemPrompt: string, idea: string, apiKey: string): Promise<unknown> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://valisearch.app",
      "X-Title": "ValiSearch",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-6",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this startup idea: ${idea}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI call failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  return JSON.parse(content);
}

async function safeCallAI(
  frameworkId: string,
  idea: string,
  apiKey: string
): Promise<{ data: unknown; source: string }> {
  try {
    const prompt = PROMPTS[frameworkId];
    if (!prompt) throw new Error(`Unknown framework: ${frameworkId}`);
    const data = await callAI(prompt, idea, apiKey);
    return { data, source: "ai" };
  } catch (error) {
    console.error(`Framework ${frameworkId} failed:`, error);
    return { data: {}, source: "fallback" };
  }
}

// ═══════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY") ?? "";

    const supabase = createClient(supabaseUrl, serviceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check credits
    const { data: credits } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (!credits || credits.balance <= 0) {
      return new Response(JSON.stringify({ error: "No credits remaining", code: "NO_CREDITS" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { idea, analysis_type = "full" } = await req.json() as { idea: string; analysis_type?: string };

    if (!idea?.trim() || idea.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Idea too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanIdea = idea.trim().slice(0, 2000);
    const creditCost = analysis_type === "quick" ? 1 : 2;

    if (credits.balance < creditCost) {
      return new Response(
        JSON.stringify({ error: `Need ${creditCost} credits, have ${credits.balance}`, code: "INSUFFICIENT_CREDITS" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const frameworkIds = analysis_type === "quick" ? QUICK_FRAMEWORKS : ALL_FRAMEWORKS;

    // Run frameworks in parallel
    const results = await Promise.all(
      frameworkIds.map((id) => safeCallAI(id, cleanIdea, openrouterKey))
    );

    // Assemble
    const frameworks: Record<string, unknown> = {};
    const dataSources: Record<string, string> = {};

    frameworkIds.forEach((id, i) => {
      frameworks[id] = results[i].data;
      dataSources[id] = results[i].source;
    });

    // Calculate score
    let overallScore = 65;
    const problems = (frameworks.problem_prioritization as { problems?: { combined_score: number }[] })?.problems;
    if (problems?.length) {
      const avgTop3 = problems.slice(0, 3).reduce((s, p) => s + (p.combined_score || 0), 0) / 3;
      overallScore = Math.min(Math.round(avgTop3 * 5), 100);
    }

    // Save
    const { data: savedIdea } = await supabase
      .from("ideas")
      .insert({ user_id: user.id, idea_text: cleanIdea, title: cleanIdea.slice(0, 80), category: "startup" })
      .select()
      .single();

    let analysisId = null;
    if (savedIdea) {
      const { data: savedAnalysis } = await supabase.from("analysis").insert({
        idea_id: savedIdea.id,
        user_id: user.id,
        status: "completed",
        result_json: frameworks,
        data_source: "ai",
        overall_score: overallScore,
      }).select().single();
      
      if (savedAnalysis) {
        analysisId = savedAnalysis.id;
      }
    }

    // Deduct credits
    await supabase.from("credits").update({ balance: credits.balance - creditCost }).eq("user_id", user.id);
    await supabase.from("credit_transactions").insert({ user_id: user.id, amount: -creditCost, reason: `analyze_v2_${analysis_type}` });

    return new Response(
      JSON.stringify({ frameworks, dataSources, overallScore, creditsRemaining: credits.balance - creditCost, analysis_type, analysisId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: "Analysis failed", message: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
