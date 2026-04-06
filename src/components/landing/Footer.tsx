import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

const LINKS = {
  Product: ["Features", "How it works", "Changelog"],
  Company: ["About", "Blog"],
  Legal: ["Privacy", "Terms"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04]">
      <div className="max-w-[1120px] mx-auto px-5 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 w-fit">
              <img src={logoImg} alt="ValiSearch" className="h-5 w-auto" />
              <span className="text-[13px] font-semibold text-white/60 tracking-[-0.02em]">ValiSearch</span>
            </Link>
            <p className="text-[11.5px] leading-[1.7] text-white/18 max-w-[170px]">
              AI-powered startup validation for founders who move fast.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/15 mb-3.5">
                {group}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[12px] text-white/22 hover:text-white/45 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.04] py-5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <p className="text-[10.5px] text-white/15">
              © {new Date().getFullYear()} ValiSearch
            </p>
            <span className="text-white/8">·</span>
            <p className="text-[10.5px] text-white/15">
              Built by{" "}
              <a
                href="https://x.com/abdulanasbuilds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/50 transition-colors"
              >
                Abdul Anas
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { name: "X", url: "https://x.com/abdulanasbuilds" },
              { name: "GitHub", url: "https://github.com/abdulanasbuilds" },
              { name: "LinkedIn", url: "https://linkedin.com/in/abdulanasbuilds" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10.5px] text-white/15 hover:text-white/35 transition-colors duration-200"
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
