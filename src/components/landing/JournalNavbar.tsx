import { Link } from "react-router-dom";
import { useScroll, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function JournalNavbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 h-16 flex items-center ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-zinc-100 py-2' 
          : 'bg-white/50 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute inset-0 bg-zinc-900 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
              <div className="relative w-3 h-3 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-[15px] font-black tracking-tighter text-zinc-900 uppercase">
              VALISEARCH
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/blog" className="text-[13px] font-bold text-zinc-900 uppercase tracking-wider">
              Journal
            </Link>
            <a href="/#features" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              Product
            </a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            to="/register" 
            className="hidden sm:block text-[13px] font-bold text-zinc-900 hover:text-zinc-600 transition-colors uppercase tracking-wider"
          >
            Join the community
          </Link>
          <Link to="/register">
            <button className="px-4 py-1.5 bg-zinc-900 text-white text-[12px] font-bold rounded-full hover:bg-zinc-800 transition-all">
              Try VALISEARCH
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
