import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Startup Guides", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Twitter / X", href: "https://x.com/abdulanasbuilds" },
      { label: "LinkedIn", href: "https://linkedin.com/in/abdulanasbuilds" },
    ],
  },
];

export function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-white/[0.06] py-16">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-[17px] font-bold text-[#F0F0F0] tracking-tight">
              ValiSearch
            </Link>
            <p className="mt-3 text-[13px] text-[#888888] leading-[1.6] max-w-[220px]">
              Validate your startup idea before you build.
            </p>
            <p className="mt-4 text-[12px] text-[#555555]">Built in Ghana 🇬🇭</p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#888888] mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={(e) => handleClick(e, l.href)}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-[14px] text-[#888888] hover:text-[#F0F0F0] transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-8 border-t border-white/[0.06]">
          <p className="text-[12px] text-[#444444]">
            © 2026 ValiSearch. All rights reserved.
          </p>
          <p className="text-[12px] text-[#444444]">Made for founders who build.</p>
        </div>
      </div>
    </footer>
  );
}
