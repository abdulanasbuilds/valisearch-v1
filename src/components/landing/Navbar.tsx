import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-black text-white leading-none">V</span>
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.01em]">ValiSearch</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <a href="#features" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#how-it-works" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">How it Works</a>
          <a href="#pricing" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <Button variant="ghost" size="sm" className="text-[13px] text-muted-foreground h-8 px-3">Log in</Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 text-[13px] font-medium rounded-lg active:scale-[0.97] transition-transform"
            onClick={() => navigate("/")}
          >
            Get Started
          </Button>
        </div>

        <button className="md:hidden p-1.5" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <div className="flex flex-col gap-1 p-3">
            <a href="#features" className="text-[13px] text-muted-foreground px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-[13px] text-muted-foreground px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileOpen(false)}>How it Works</a>
            <a href="#pricing" className="text-[13px] text-muted-foreground px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileOpen(false)}>Pricing</a>
            <div className="pt-2 border-t border-border/40 mt-1">
              <Button size="sm" className="bg-primary text-primary-foreground w-full text-[13px]">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
