import { Link } from "react-router-dom";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 20));
  }, [scrollY]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-200 h-14 flex items-center ${isScrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'}`}>
        <div className="section-container w-full flex items-center justify-between px-4">
          <Link to="/" className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>ValiSearch</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link to="/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
          </div>

          <button 
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-zinc-950 flex flex-col p-6 pt-20 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium text-zinc-400">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-zinc-100 text-zinc-900 text-center py-3 rounded-lg font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </>
  );
}

export function AnnouncementBar() {
  return null;
}