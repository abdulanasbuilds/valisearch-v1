import { Link } from "react-router-dom";

const footerLinks = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-end gap-[3px]">
                {[1, 0.75, 0.5, 0.3].map((opacity, i) => (
                  <div
                    key={i}
                    className="w-[7px] h-[7px] rounded-[2px] bg-violet-400"
                    style={{ opacity }}
                  />
                ))}
              </div>
              <span className="text-[15px] font-semibold text-white">ValiSearch</span>
            </Link>
            <p className="text-[13px] leading-[1.7] text-white/30 max-w-[220px]">
              AI-powered startup validation for founders who build smart.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/25 mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-white/35 hover:text-white/70 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-[12px] text-white/20">
            © {new Date().getFullYear()} ValiSearch, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter / X", "GitHub", "Discord"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-[12px] text-white/20 hover:text-white/50 transition-colors duration-200"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
