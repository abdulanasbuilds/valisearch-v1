import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          {/* Logo with 4 dots in descending opacity */}
          <div className="flex items-end gap-1">
            <div className="w-2 h-2 rounded-sm bg-primary opacity-100" />
            <div className="w-2 h-2 rounded-sm bg-primary opacity-75" />
            <div className="w-2 h-2 rounded-sm bg-primary opacity-50" />
            <div className="w-2 h-2 rounded-sm bg-primary opacity-25" />
          </div>
          <span className="text-[16px] font-bold tracking-[-0.02em] text-white">ValiSearch</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-[14px] text-muted-foreground/70 transition-all hover:text-foreground hover:scale-[1.02]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[14px] text-muted-foreground/70 transition-all hover:text-foreground hover:scale-[1.02]"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-[14px] text-muted-foreground/70 transition-all hover:text-foreground hover:scale-[1.02]"
          >
            Pricing
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-[14px] text-muted-foreground/70 hover:text-foreground h-10 px-4 rounded-[12px] hover:bg-white/[0.05]"
          >
            Log in
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-10 px-5 text-[14px] font-semibold rounded-[12px] transition-all shadow-lg shadow-primary/20"
            onClick={() => navigate("/")}
          >
            Get Started
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-background/95 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1 p-4">
            <a
              href="#features"
              className="text-[14px] text-muted-foreground/70 px-4 py-3 rounded-[12px] hover:bg-white/[0.05] hover:text-foreground transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[14px] text-muted-foreground/70 px-4 py-3 rounded-[12px] hover:bg-white/[0.05] hover:text-foreground transition-all"
              onClick={() => setMobileOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-[14px] text-muted-foreground/70 px-4 py-3 rounded-[12px] hover:bg-white/[0.05] hover:text-foreground transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
            <div className="pt-3 border-t border-white/[0.06] mt-2">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full text-[14px] font-semibold rounded-[12px] h-11 shadow-lg shadow-primary/20"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
