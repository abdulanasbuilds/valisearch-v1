"use client";

import { Link } from "react-router-dom";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, Github } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Methodology", href: "/#how-it-works" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Insights", href: "/blog" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 h-16 flex items-center ${
          isScrolled 
            ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/[0.05] py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="section-container w-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-white rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                <div className="relative w-3.5 h-3.5 bg-black rounded-sm rotate-45" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white uppercase">
                VALISEARCH
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                link.href.startsWith('/') && !link.href.includes('#') ? (
                  <Link 
                    key={link.name}
                    to={link.href} 
                    className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a 
                    key={link.name}
                    href={link.href} 
                    className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <a 
                href="https://github.com/abdulanasbuilds/valisearch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
                <span className="text-[10px] bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
                  1.2k
                </span>
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/login" 
              className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors duration-300"
            >
              Log in
            </Link>
            <Link to="/register">
              <button className="px-5 py-2 bg-white text-black text-[13px] font-bold rounded-full hover:bg-zinc-200 transition-all duration-300 active:scale-95 shadow-[0_8px_30px_rgb(255,255,255,0.1)]">
                Get Started
              </button>
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[90] bg-[#0A0A0A] flex flex-col p-8 pt-24 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                link.href.startsWith('/') && !link.href.includes('#') ? (
                  <Link 
                    key={link.name}
                    to={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-bold text-white hover:text-zinc-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a 
                    key={link.name}
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-bold text-white hover:text-zinc-400 transition-colors"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="h-px w-full bg-white/10 my-2" />
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-semibold text-zinc-400"
              >
                Log in
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)} 
                className="w-full bg-white text-black text-center py-4 rounded-2xl font-bold text-lg active:scale-[0.98] transition-transform"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function AnnouncementBar() {
  return null;
}