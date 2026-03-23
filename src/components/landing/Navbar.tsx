import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features",    href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing",     href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" data-testid="link-logo">
          <div className="flex items-center justify-center w-[28px] h-[28px] rounded-[7px] bg-white shadow-sm">
            <span className="text-[10.5px] font-black text-black leading-none tracking-[-0.05em]">VS</span>
          </div>
          <span className="text-[14.5px] font-semibold text-white/85 tracking-[-0.025em]">ValiSearch</span>
        </Link>

        {/* Center nav */}
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

        {/* Right */}
        <div className="hidden md:flex items-center gap-1">
          <button className="nav-pill relative px-3.5 py-2 text-[13.5px] font-medium text-white/38 hover:text-white/72 transition-colors duration-200 rounded-[6px]">
            Log in
          </button>
          <button
            data-testid="button-get-started-nav"
            onClick={() => navigate("/")}
            className="ml-1 flex items-center gap-1.5 px-4 py-[7px] text-[13.5px] font-semibold text-black bg-white rounded-[8px] hover:bg-white/90 transition-all duration-150 active:scale-[0.97]"
          >
            Get started
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1.5 text-white/35 hover:text-white/65 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {/* Mobile dropdown */}
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
            <div className="pt-2 mt-1 border-t border-white/[0.055]">
              <button
                onClick={() => { navigate("/"); setMobileOpen(false); }}
                className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-black bg-white hover:bg-white/90 transition-all"
              >
                Get started
              </button>
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
