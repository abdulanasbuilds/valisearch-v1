import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
      }
    }
  };

  const links = [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#changelog" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] h-16 flex items-center transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="section-container w-full flex items-center justify-between">
          <Link to="/" className="text-[17px] font-bold tracking-tight text-white">
            ValiSearch
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-white/60">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/login"
              className="text-[14px] font-medium text-white/70 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-[#6C47FF] hover:bg-[#7C5AFF] text-white text-[14px] font-semibold px-5 py-2 rounded-md transition-colors"
            >
              Start free
            </Link>
          </div>

          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-[#0A0A0A] flex flex-col p-8 pt-24 md:hidden">
          <div className="flex flex-col gap-6 text-xl font-medium text-white/70">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-white"
                onClick={(e) => handleLinkClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            <div className="h-px bg-white/[0.06] my-4" />
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#6C47FF] text-white text-center py-3 rounded-md font-semibold"
            >
              Start free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
