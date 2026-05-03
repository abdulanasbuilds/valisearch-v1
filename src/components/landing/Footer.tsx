import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Intelligence Box", href: "/workspace" },
    { label: "Methodology", href: "/#how-it-works" },
  ],
  resources: [
    { label: "Journal", href: "/blog" },
    { label: "Documentation", href: "/docs" },
    { label: "Community", href: "/community" },
    { label: "Expert Network", href: "/experts" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Build Log", href: "/build-log" },
    { label: "Contact", href: "mailto:anaswebagency@gmail.com" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const SOCIALS = [
  { icon: Twitter, href: "https://x.com/abdulanasbuilds", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/abdul-anas-0161b3370", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/abdulanasbuilds", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 pt-24 pb-12 relative z-10 overflow-hidden grain-bg">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-24">
          <div className="col-span-2 md:col-span-4 lg:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 group mb-8">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/5 rounded-xl rotate-45 group-hover:bg-white transition-all duration-500" />
                <div className="relative w-3.5 h-3.5 bg-white group-hover:bg-black rounded-sm rotate-45 transition-colors" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                VALISEARCH
              </span>
            </Link>
            <p className="text-[15px] text-zinc-500 leading-relaxed max-w-sm mb-10">
              Transforming startup uncertainty into mathematical clarity. The professional validation engine for the next generation of builders.
            </p>
            <div className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em] mb-8">Product</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em] mb-8">Resources</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-[14px] text-zinc-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em] mb-8">Legal</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-[14px] text-zinc-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 order-2 md:order-1">
            <p className="text-[12px] font-medium text-zinc-600">
              © {new Date().getFullYear()} VALISEARCH
            </p>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">All Systems Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-2 order-1 md:order-2">
            <span className="text-[12px] font-medium text-zinc-600">Crafted with precision by</span>
            <a 
              href="https://www.linkedin.com/in/abdul-anas-0161b3370" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[12px] font-bold text-white hover:underline flex items-center gap-1"
            >
              Abdul Anas <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}