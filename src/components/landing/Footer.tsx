import { Link } from "react-router-dom";

const SOCIALS = [
  { label: "Twitter", href: "https://x.com/abdulanasbuilds" },
  { label: "LinkedIn", href: "https://linkedin.com/in/abdulanas" },
  { label: "GitHub", href: "https://github.com/abdulanasbuilds" },
];

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 py-24 relative z-10 overflow-hidden">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5 group mb-6">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 rounded-lg rotate-45 group-hover:bg-white transition-all duration-500" />
                <div className="relative w-3 h-3 bg-white group-hover:bg-black rounded-sm rotate-45 transition-colors" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white">
                vali.search
              </span>
            </Link>
            <p className="text-[14px] text-zinc-600 leading-relaxed font-medium">
              The professional validation engine for serious founders and product teams. Build with certainty.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Methodology</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/privacy" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6">Social</h4>
              <ul className="space-y-4">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-zinc-500 hover:text-white transition-colors"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} ValiSearch. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-[0.2em]">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}