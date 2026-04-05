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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { idea, competitors } = await req.json();
    if (!idea || typeof idea !== "string") {
      return new Response(JSON.stringify({ error: "idea is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Record<string, unknown>[] = [];
    const braveKey = Deno.env.get("BRAVE_SEARCH_API_KEY");
    const serpKey = Deno.env.get("SERPAPI_KEY");

    const searchTerms = Array.isArray(competitors) && competitors.length > 0
      ? competitors
      : [`${idea} competitors`, `${idea} alternatives`];

    for (const term of searchTerms.slice(0, 5)) {
      if (braveKey) {
        try {
          const res = await fetch(
            `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(term)}&count=5`,
            { headers: { "X-Subscription-Token": braveKey, Accept: "application/json" } }
          );
          if (res.ok) {
            const data = await res.json();
            results.push({ query: term, source: "brave", results: data.web?.results?.slice(0, 5) || [] });
          }
        } catch (e) {
          console.error("Brave search error:", e.message);
        }
      } else if (serpKey) {
        try {
          const res = await fetch(
            `https://serpapi.com/search.json?q=${encodeURIComponent(term)}&api_key=${serpKey}&num=5`
          );
          if (res.ok) {
            const data = await res.json();
            results.push({ query: term, source: "serpapi", results: data.organic_results?.slice(0, 5) || [] });
          }
        } catch (e) {
          console.error("SerpAPI error:", e.message);
        }
      }
    }

    return new Response(JSON.stringify({ competitors: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
