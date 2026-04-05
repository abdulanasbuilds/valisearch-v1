import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { isSupabaseConfigured } from "@/config/env";
import logoImg from "@/assets/logo.png";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.055] bg-[#0A0A0A]/88 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[58px] max-w-6xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" data-testid="link-logo">
          <img src={logoImg} alt="ValiSearch" className="h-7 w-auto" />
          <span className="text-[14.5px] font-semibold text-white/85 tracking-[-0.025em]">ValiSearch</span>
        </Link>

        <nav className="hidden md:flex items-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-pill relative px-3.5 py-2 text-[13.5px] font-medium text-white/38 transition-colors duration-200 hover:text-white/72"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 px-4 py-[7px] text-[13.5px] font-semibold text-black bg-white rounded-[8px] hover:bg-white/90 transition-all duration-150 active:scale-[0.97]"
            >
              Dashboard
            </button>
          ) : (
            <>
              {isSupabaseConfigured() && (
                <Link
                  to="/login"
                  className="px-3.5 py-[7px] text-[13.5px] font-medium text-white/38 hover:text-white/72 transition-colors"
                >
                  Sign in
                </Link>
              )}
              <button
                data-testid="button-get-started-nav"
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 px-4 py-[7px] text-[13.5px] font-semibold text-black bg-white rounded-[8px] hover:bg-white/90 transition-all duration-150 active:scale-[0.97]"
              >
                Try it free
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-1.5 text-white/35 hover:text-white/65 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="border-t border-white/[0.055] bg-[#0A0A0A]/95 backdrop-blur-2xl md:hidden"
          style={{ animation: "fadeDown 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="flex flex-col p-3 gap-0.5 max-w-6xl mx-auto px-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2.5 text-[14px] font-medium text-white/45 rounded-lg hover:text-white/75 hover:bg-white/[0.04] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 mt-1 border-t border-white/[0.055] space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
                  className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-black bg-white hover:bg-white/90 transition-all"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  {isSupabaseConfigured() && (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full py-2.5 rounded-lg text-center text-[14px] font-medium text-white/50 hover:text-white/75 transition-colors"
                    >
                      Sign in
                    </Link>
                  )}
                  <button
                    onClick={() => { navigate("/"); setMobileOpen(false); }}
                    className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-black bg-white hover:bg-white/90 transition-all"
                  >
                    Try it free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
