import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ExternalLink } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { isStripeConfigured } from "@/config/env";
import { useState } from "react";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

import { LS_STORE_URL, LS_PRO_VARIANT_ID } from "@/lib/constants";
import { useUserStore } from "@/store/useUserStore";

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!LS_STORE_URL || !LS_PRO_VARIANT_ID || LS_PRO_VARIANT_ID === 'REPLACE_WITH_YOUR_PRO_ID') {
        setError("Payment system is not yet configured with real Variant IDs.");
        setLoading(false);
        return;
      }
      
      let checkoutUrl = `${LS_STORE_URL}/checkout/buy/${LS_PRO_VARIANT_ID}?embed=1`;
      
      if (user) {
        checkoutUrl += `&checkout[email]=${encodeURIComponent(user.email)}`;
        checkoutUrl += `&checkout[custom][user_id]=${user.id}`;
      }
      
      window.open(checkoutUrl, '_blank');
      onClose(); // Close modal immediately after popping open the new tab
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-background/80 backdrop-blur-xl border border-border/40 shadow-2xl max-w-md">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            You've used all your free AI credits. Upgrade to Pro to unlock unlimited analyses, deeper competitor insights, and priority AI processing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <div className="rounded-xl border border-border/40 bg-muted/30 p-4 space-y-2">
            {[
              "50 additional AI-powered analyses",
              "Priority model access (GPT-4, Claude)",
              "Advanced competitor & market reports",
              "PDF & JSON export",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                <span className="text-primary">✓</span>
                {f}
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ExternalLink className="h-4 w-4 mr-2" />
            )}
            {loading ? "Redirecting…" : "Upgrade — $29/mo"}
          </Button>

          <button
            onClick={onClose}
            className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
