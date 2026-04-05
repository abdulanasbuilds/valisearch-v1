/**
 * Database service — all Supabase DB operations.
 * Falls back gracefully when Supabase is not configured.
 */

import { getSupabase } from "@/lib/supabase";
import type { ValiSearchAnalysis } from "@/types/analysis";

// ─── Analysis ─────────────────────────────────────────────────────────────

export async function saveAnalysis(
  userId: string,
  ideaText: string,
  result: ValiSearchAnalysis,
  source: "ai" | "mock"
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  // First save the idea
  const { data: idea, error: ideaErr } = await supabase
    .from("ideas")
    .insert({ user_id: userId, idea_text: ideaText, title: ideaText.slice(0, 120) })
    .select("id")
    .single();

  if (ideaErr || !idea) {
    console.error("[db] Failed to save idea:", ideaErr);
    return null;
  }

  // Then save the analysis
  const { data: analysis, error: analysisErr } = await supabase
    .from("analysis")
    .insert({
      idea_id: idea.id,
      user_id: userId,
      result_json: result,
      data_source: source,
    })
    .select("id")
    .single();

  if (analysisErr) {
    console.error("[db] Failed to save analysis:", analysisErr);
    return null;
  }

  return analysis?.id ?? null;
}

export async function getUserAnalyses(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("analysis")
    .select(`
      id, result_json, data_source, created_at,
      ideas!inner(id, idea_text, title)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[db] Failed to fetch analyses:", error);
    return [];
  }
  return data ?? [];
}

export async function getAnalysisById(id: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("analysis")
    .select(`*, ideas(*)`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("[db] Failed to fetch analysis:", error);
    return null;
  }
  return data;
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from("analysis").delete().eq("id", id);
  return !error;
}

// ─── Credits ──────────────────────────────────────────────────────────────

export async function getUserCredits(userId: string): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 15; // Default fallback

  const { data, error } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", userId)
    .single();

  if (error || !data) return 15;
  return data.balance;
}

export async function deductCredit(userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return true; // Allow in demo mode

  // Get current balance
  const { data: credit } = await supabase
    .from("credits")
    .select("id, balance")
    .eq("user_id", userId)
    .single();

  if (!credit || credit.balance <= 0) return false;

  // Deduct
  const { error } = await supabase
    .from("credits")
    .update({ balance: credit.balance - 1, updated_at: new Date().toISOString() })
    .eq("id", credit.id);

  if (error) return false;

  // Log transaction
  await supabase.from("credit_transactions").insert({
    user_id: userId,
    amount: -1,
    reason: "analyze",
  });

  return true;
}

export async function addCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data: credit } = await supabase
    .from("credits")
    .select("id, balance")
    .eq("user_id", userId)
    .single();

  if (!credit) return false;

  const { error } = await supabase
    .from("credits")
    .update({ balance: credit.balance + amount, updated_at: new Date().toISOString() })
    .eq("id", credit.id);

  if (error) return false;

  await supabase.from("credit_transactions").insert({
    user_id: userId,
    amount,
    reason,
  });

  return true;
}
