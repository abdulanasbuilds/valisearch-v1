"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ExternalLink, Check } from "lucide-react";
import { useState } from "react";
import { LS_STORE_URL, LS_PRO_VARIANT_ID, LS_PREMIUM_VARIANT_ID } from "@/lib/constants";
import { useUserStore } from "@/store/useUserStore";
import { getSupabase } from "@/lib/supabase";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);
    setError(null);

    try {
      const supabase = getSupabase();
      const { data, error: invokeError } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (invokeError) throw new Error(invokeError.message || "Failed to start checkout");
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Invalid response from checkout service");
      }
    } catch (e: any) {
      setError(e.message || "Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      credits: "15 credits",
      features: ["Standard AI analysis", "Market overview", "Basic competitor data"],
      button: "Current Plan",
      disabled: true,
      variantId: "free"
    },
    {
      name: "Pro",
      price: "$29",
      credits: "200 credits",
      features: ["Advanced AI analysis", "Full competitor depth", "PDF/JSON Exports", "Priority support"],
      button: "Upgrade to Pro",
      variantId: LS_PRO_VARIANT_ID,
      popular: true
    },
    {
      name: "Premium",
      price: "$79",
      credits: "Unlimited",
      features: ["Unlimited analysis", "IDE Bridge access", "Team collaboration", "White-label reports"],
      button: "Go Premium",
      variantId: LS_PREMIUM_VARIANT_ID
    }
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#0D0D0D]/95 backdrop-blur-xl border border-white/10 shadow-2xl max-w-4xl p-0 overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-3xl font-bold text-white tracking-tight">
            Level up your startup intelligence
          </DialogTitle>
          <DialogDescription className="text-white/50 text-base mt-2">
            Choose the plan that fits your execution speed.
          </DialogDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col border transition-all duration-300 ${
                plan.popular 
                  ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20 scale-[1.02] z-10' 
                  : 'bg-white/[0.02] border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm">/mo</span>
                </div>
                <div className="mt-2 text-primary font-semibold text-sm">{plan.credits}</div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full py-6 font-bold ${
                  plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/15'
                }`}
                variant={plan.popular ? "default" : "secondary"}
                onClick={() => plan.variantId !== 'free' && handleCheckout(plan.variantId)}
                disabled={plan.disabled || (loading !== null)}
              >
                {loading === plan.variantId ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {plan.button}
              </Button>
            </div>
          ))}
        </div>

        {error && (
          <div className="mx-8 mb-8 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <div className="bg-white/[0.03] border-t border-white/5 p-4 text-center">
          <p className="text-[11px] text-white/30 uppercase tracking-[0.2em]">
            Secure checkout powered by Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

