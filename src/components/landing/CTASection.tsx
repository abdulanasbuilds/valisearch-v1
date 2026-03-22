import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 border-t border-border/30">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
            Stop guessing. Start validating.
          </h2>
          <p className="mt-4 text-[14px] text-muted-foreground leading-relaxed">
            Join thousands of founders who validate ideas before investing months of work.
          </p>
          <Button
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-7 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-lg text-[13px] font-medium active:scale-[0.97] transition-transform"
          >
            Try ValiSearch — it's free
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
