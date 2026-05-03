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

export function JournalFooter() {
  return (
    <footer className="bg-white border-t border-zinc-100 pt-24 pb-12 relative z-10 overflow-hidden grain-bg">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-24">
          <div className="col-span-2 md:col-span-4 lg:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 group mb-8">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-zinc-900 rounded-xl rotate-45 group-hover:bg-zinc-800 transition-all duration-500" />
                <div className="relative w-3.5 h-3.5 bg-white rounded-sm rotate-45 transition-colors" />
              </div>
              <span className="text-xl font-black tracking-tighter text-zinc-900 uppercase">
                VALISEARCH
              </span>
            </Link>
            <p className="text-[15px] text-zinc-500 leading-relaxed max-w-sm mb-10 font-medium">
              The intelligence platform for the next generation of builders. Validate ideas, analyze markets, and execute with clarity.
            </p>
            <div className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-white hover:shadow-xl transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.25em] mb-8">Product</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.25em] mb-8">Journal</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.25em] mb-8">Legal</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 order-2 md:order-1">
            <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">
              © {new Date().getFullYear()} VALISEARCH
            </p>
          </div>

          <div className="flex items-center gap-2 order-1 md:order-2">
            <span className="text-[12px] font-medium text-zinc-500">Built by</span>
            <a 
              href="https://www.linkedin.com/in/abdul-anas-0161b3370" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[12px] font-bold text-zinc-900 hover:underline flex items-center gap-1"
            >
              Abdul Anas <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
