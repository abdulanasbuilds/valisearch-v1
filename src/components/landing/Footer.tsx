import { Link } from "react-router-dom";

const LINKS = {
  Product: ["Features", "How it works", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-white">
                <span className="text-[11px] font-black text-black leading-none tracking-[-0.04em]">VS</span>
              </div>
              <span className="text-[14px] font-semibold text-white/70 tracking-[-0.02em]">ValiSearch</span>
            </Link>
            <p className="text-[12.5px] leading-[1.7] text-white/25 max-w-[180px]">
              AI-powered startup validation for founders who move fast.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/20 mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover-underline text-[13px] text-white/30 hover:text-white/55 transition-colors duration-150"
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
        <div className="border-t border-white/[0.05] py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <p className="text-[11.5px] text-white/20 font-medium">
              © {new Date().getFullYear()} ValiSearch, Inc.
            </p>
            <span className="hidden sm:inline text-white/10">·</span>
            <p className="text-[11.5px] text-white/20 font-medium">
              Built by <a href="https://x.com/abdulanasbuilds" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/60 transition-colors">Abdul Anas</a>
            </p>
          </div>
          <div className="flex items-center gap-5">
            {[
              { name: "X", url: "https://x.com/abdulanasbuilds" },
              { name: "GitHub", url: "https://github.com/abdulanasbuilds" },
              { name: "LinkedIn", url: "https://linkedin.com/in/abdulanasbuilds" },
              { name: "Instagram", url: "https://instagram.com/abdulanasbuilds" },
              { name: "YouTube", url: "https://youtube.com/@abdulanasbuilds" },
              { name: "TikTok", url: "https://tiktok.com/@abdulanasbuilds" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11.5px] text-white/20 hover:text-white/45 transition-colors duration-150"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
