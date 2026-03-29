import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
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
              "Unlimited AI-powered analyses",
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

          <Button className="w-full" size="lg" onClick={onClose}>
            Coming Soon
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
