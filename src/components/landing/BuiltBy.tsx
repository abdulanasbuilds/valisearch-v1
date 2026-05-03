import { Github, Twitter, Linkedin, Globe } from "lucide-react";

const SOCIAL_LINKS = [
  {
    name: "Twitter / X",
    handle: "@abdulanasbuilds",
    href: "https://x.com/abdulanasbuilds",
    icon: Twitter,
  },
  {
    name: "GitHub",
    handle: "@abdulanasbuilds",
    href: "https://github.com/abdulanasbuilds",
    icon: Github,
  },
  {
    name: "LinkedIn",
    handle: "Abdul Anas",
    href: "https://www.linkedin.com/in/abdul-anas-0161b3370",
    icon: Linkedin,
  },
  {
    name: "Website",
    handle: "abdulanas.dev",
    href: "https://abdulanas.dev",
    icon: Globe,
  },
];

export function BuiltBy() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 50% 30% at 50% 100%, rgba(99, 102, 241, 0.1) 0%, transparent 60%),
              radial-gradient(ellipse 30% 20% at 80% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white/60">
              Independently Crafted
            </span>
          </div>

          {/* Main heading */}
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white leading-tight tracking-tight mb-4">
            Built by{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Abdul Anas
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-white/50 max-w-[480px] mb-10 leading-relaxed">
            A solo developer on a mission to help founders validate their ideas 
            before investing months of work. Follow the journey.
          </p>

          {/* Social links */}
          <div className="flex flex-wrap justify-center gap-3">
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] 
                           hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300
                           hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]"
                >
                  <Icon className="w-5 h-5 text-white/50 group-hover:text-[#818cf8] transition-colors duration-300" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors duration-300">
                      {link.name}
                    </span>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                      {link.handle}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://x.com/abdulanasbuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#818cf8] to-[#6366f1] text-white font-medium
                       hover:from-[#6366f1] hover:to-[#4f46e5] transition-all duration-300 
                       shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            >
              Follow @abdulanasbuilds
            </a>
            <span className="text-sm text-white/30">
              Join 2,000+ builders on this journey
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
