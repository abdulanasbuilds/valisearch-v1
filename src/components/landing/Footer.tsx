import { Link } from "react-router-dom";

const SOCIALS = [
  { label: "Twitter", href: "https://x.com/abdulanasbuilds" },
  { label: "LinkedIn", href: "https://linkedin.com/in/abdulanasbuilds" },
  { label: "GitHub", href: "https://github.com/abdulanasbuilds" },
];

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <Link to="/" className="text-lg font-bold text-white flex items-center gap-2">
            ValiSearch
          </Link>

          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link to="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
          </div>

          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-600 text-center">
          ValiSearch. Built for founders who build.
        </p>
      </div>
    </footer>
  );
}