import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-end gap-[3px]">
            {[1, 0.75, 0.5, 0.3].map((opacity, i) => (
              <div
                key={i}
                className="w-[7px] h-[7px] rounded-[2px] bg-violet-400 transition-all duration-300 group-hover:bg-violet-300"
                style={{ opacity }}
              />
            ))}
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
            ValiSearch
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-lg text-[14px] text-white/55 transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button className="px-4 py-2 text-[14px] text-white/55 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.06]">
            Log in
          </button>
          <button
            onClick={() => navigate("/")}
            data-testid="button-get-started-nav"
            className="glow-btn relative px-4 py-2 text-[14px] font-medium text-white rounded-lg bg-violet-600 hover:bg-violet-500 transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            Get Started
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-3 rounded-xl text-[14px] text-white/55 hover:text-white hover:bg-white/[0.06] transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/[0.06] mt-1">
              <button
                onClick={() => { navigate("/"); setMobileOpen(false); }}
                className="w-full py-3 rounded-xl text-[14px] font-medium text-white bg-violet-600 hover:bg-violet-500 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
