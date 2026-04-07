import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { isSupabaseConfigured } from "@/config/env";
import logoImg from "@/assets/logo.png";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        scrolled
          ? "bg-[#060606]/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/[0.04]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 md:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0 group" data-testid="link-logo">
          <img
            src={logoImg}
            alt="ValiSearch"
            className="h-[22px] w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-[13.5px] font-semibold text-white/80 tracking-[-0.02em]">
            ValiSearch
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-3 py-1.5 text-[13px] font-medium text-white/35 transition-colors duration-200 hover:text-white/70 rounded-md"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2.5">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="h-8 px-4 text-[12.5px] font-semibold text-background bg-foreground rounded-md hover:bg-foreground/90 transition-all duration-200 active:scale-[0.97]"
            >
              Dashboard
            </button>
          ) : (
            <>
              {isSupabaseConfigured() && (
                <Link
                  to="/login"
                  className="h-8 flex items-center px-3 text-[12.5px] font-medium text-white/40 hover:text-white/70 transition-colors duration-200"
                >
                  Log in
                </Link>
              )}
              <button
                data-testid="button-get-started-nav"
                onClick={() => {
                  const el = document.getElementById("idea-input");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    setTimeout(() => el.focus(), 500);
                  }
                }}
                className="h-8 px-4 text-[12.5px] font-semibold text-background bg-foreground rounded-md hover:bg-foreground/90 transition-all duration-200 active:scale-[0.97]"
              >
                Get started
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-1.5 text-white/35 hover:text-white/65 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.04] bg-[#060606]/95 backdrop-blur-2xl md:hidden animate-fade-in">
          <div className="flex flex-col p-4 gap-0.5 max-w-[1120px] mx-auto">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2.5 text-[14px] font-medium text-white/40 rounded-lg hover:text-white/70 hover:bg-white/[0.03] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-white/[0.04] flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
                  className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-background bg-foreground hover:bg-foreground/90 transition-all"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  {isSupabaseConfigured() && (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full py-2.5 rounded-lg text-center text-[14px] font-medium text-white/45 hover:text-white/70 transition-colors"
                    >
                      Log in
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      const el = document.getElementById("idea-input");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                        setTimeout(() => el.focus(), 500);
                      }
                    }}
                    className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-background bg-foreground hover:bg-foreground/90 transition-all"
                  >
                    Get started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
