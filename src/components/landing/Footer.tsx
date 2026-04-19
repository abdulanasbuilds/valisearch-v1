import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github, Youtube, Instagram, TrendingUp } from "lucide-react";

const ABDUL_PHOTO = "https://p16-common-sign.tiktokcdn.com/tos-maliva-avt-0068/5bdbb67e8b05c8e5e58697d616ab66ad~tplv-tiktokx-cropcenter:1080:1080.jpeg";

const SOCIALS = [
  { icon: Twitter, label: "Twitter/X", href: "https://x.com/abdulanasbuilds" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/abdulanasbuilds" },
  { icon: TrendingUp, label: "TikTok", href: "https://tiktok.com/@abdulanasbuilds" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/abdulanasbuilds" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@abdulanasbuilds" },
  { icon: Github, label: "GitHub", href: "https://github.com/abdulanasbuilds" },
];

export function Footer() {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/[0.06] py-20">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Built By Section */}
        <div className="flex flex-col items-center justify-center mb-20">
          <img 
            src={ABDUL_PHOTO} 
            alt="Abdul Anas" 
            className="w-20 h-20 rounded-full object-cover mb-5 border-2 border-white/20"
          />
          <h3 className="text-lg font-bold text-white mb-2">Abdul Anas</h3>
          <p className="text-sm text-white/40 mb-6 text-center max-w-md">
            Founder & maker behind ValiSearch. Building tools for the next generation of founders.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-[18px] font-bold text-white tracking-tight">
              ValiSearch
            </Link>
            <p className="mt-4 text-[14px] text-white/30 leading-relaxed max-w-[240px]">
              The technical standard for startup validation.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-3">
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Documentation", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Startup Guides", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About", href: "#" },
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-[12px] text-white/30">
            © 2026 ValiSearch. All rights reserved.
          </p>
          <p className="text-[12px] text-white/30">
            Made for founders who build.
          </p>
        </div>
      </div>
    </footer>
  );
}