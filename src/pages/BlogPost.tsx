import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { getPostContent } from "@/lib/blog";
import { BLOG_POSTS } from "@/content/blog";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Clock, Sparkles, Share2 } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

interface TocItem { id: string; text: string; level: number }

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<{ metadata: Record<string, string>; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadPost() {
      if (!slug) return;
      setIsLoading(true);
      const data = await getPostContent(slug);
      if (cancelled) return;
      setPost(data);
      if (data) document.title = `${data.metadata.title} | ValiSearch`;
      setIsLoading(false);
    }
    loadPost();
    return () => { cancelled = true };
  }, [slug]);

  const toc: TocItem[] = useMemo(() => {
    if (!post) return [];
    const lines = post.content.split("\n");
    const items: TocItem[] = [];
    for (const line of lines) {
      const m = line.match(/^(#{2,3})\s+(.*)/);
      if (m) items.push({ level: m[1].length, text: m[2].replace(/[*_`]/g, ""), id: slugify(m[2]) });
    }
    return items;
  }, [post]);

  // Sticky title bar + active TOC tracking
  useEffect(() => {
    if (!post) return;
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 480);
      const headings = articleRef.current?.querySelectorAll<HTMLElement>("h2, h3");
      if (!headings) return;
      let current = "";
      headings.forEach((h) => {
        const top = h.getBoundingClientRect().top;
        if (top < 160) current = h.id;
      });
      if (current) setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [post]);

  const handleShare = async () => {
    if (!post) return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: post.metadata.title, url }); } catch (e) { console.error(e); }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-3">Article not found</h1>
        <Link to="/blog" className="text-zinc-400 hover:text-white underline">Back to all articles</Link>
      </div>
    );
  }

  const { metadata, content } = post;
  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  const readMins = parseInt(String(metadata.readTime || "5")) || 5;

  // Inline CTA inserted ~ middle
  const paragraphs = content.split(/\n\n+/);
  const midIdx = Math.floor(paragraphs.length / 2);
  const partA = paragraphs.slice(0, midIdx).join("\n\n");
  const partB = paragraphs.slice(midIdx).join("\n\n");

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white selection:bg-zinc-800">
      <Navbar />

      {/* Sticky reading bar */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 border-b border-white/[0.06] bg-[#0A0A0A]/85 backdrop-blur-xl transition-all duration-300 ${
          showStickyBar ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-12 flex items-center justify-between gap-6">
          <p className="text-sm font-medium text-zinc-300 truncate">{metadata.title}</p>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleShare} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <Link to="/register" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black text-xs font-semibold rounded-md hover:bg-zinc-200 transition-colors">
              Try ValiSearch <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <main className="pt-28 pb-24">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Floating TOC */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-4">On this page</p>
                <nav className="space-y-2 border-l border-white/10">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-[13px] leading-snug pl-4 -ml-px py-1 border-l-2 transition-colors ${
                        item.level === 3 ? "pl-7" : ""
                      } ${
                        activeId === item.id
                          ? "border-white text-white font-medium"
                          : "border-transparent text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Article body */}
            <article className="lg:col-span-9 xl:col-span-7 xl:col-start-4 mx-auto" style={{ maxWidth: "700px" }}>
              <header className="mb-12">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-500 mb-5 uppercase tracking-[0.2em]">
                    <span className="text-white bg-white/10 px-2.5 py-1 rounded-md">{metadata.category}</span>
                    <span>{new Date(metadata.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" />{readMins} min read</span>
                  </div>
                  <h1 className="text-4xl md:text-[52px] font-bold leading-[1.08] tracking-tight mb-8">
                    {metadata.title}
                  </h1>
                  <div className="flex items-center justify-between gap-4 py-5 border-y border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold">AA</div>
                      <div>
                        <div className="text-sm font-semibold text-white">{metadata.author}</div>
                        <div className="text-xs text-zinc-500">Founder, ValiSearch</div>
                      </div>
                    </div>
                    <button onClick={handleShare} className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </motion.div>

                {/* Hero image */}
                <div className="mt-10 aspect-[16/9] rounded-[10px] overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] relative">
                  <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
                    style={{ backgroundImage: "radial-gradient(circle at 25% 30%, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
                </div>
              </header>

              <div ref={articleRef} className="article-prose">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      return <h2 id={slugify(text)}>{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      return <h3 id={slugify(text)}>{children}</h3>;
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="key-takeaway">{children}</blockquote>
                    ),
                  }}
                >
                  {partA}
                </ReactMarkdown>

                {/* Inline bento CTA */}
                <aside className="not-prose my-12 rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-2">From the makers</p>
                      <h4 className="text-lg font-semibold tracking-tight text-white mb-2">
                        Validate your idea in 30 seconds
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                        ValiSearch turns this entire framework into a one-click report — market sizing, competitors, GTM and risk, scored.
                      </p>
                      <Link to="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-zinc-300 transition-colors">
                        Try it free <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </aside>

                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      return <h2 id={slugify(text)}>{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      return <h3 id={slugify(text)}>{children}</h3>;
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="key-takeaway">{children}</blockquote>
                    ),
                  }}
                >
                  {partB}
                </ReactMarkdown>
              </div>

              {/* Footer CTA */}
              <footer className="mt-20 pt-12 border-t border-white/10">
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-10 md:p-12">
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-3">Stop guessing</p>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    Run your idea through the same framework — instantly.
                  </h3>
                  <p className="text-zinc-400 mb-7 max-w-lg leading-relaxed">
                    ValiSearch gives you a structured validation report in under a minute, with citations, scores and a Go-To-Market plan.
                  </p>
                  <Link to="/register" className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors text-sm">
                    Start a free analysis <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Related */}
                {related.length > 0 && (
                  <div className="mt-16">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-300 mb-6 uppercase tracking-[0.2em]">Continue reading</h3>
                    <div className="grid sm:grid-cols-3 gap-6">
                      {related.map((p) => (
                        <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                          <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/5 mb-3" />
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">{p.category}</span>
                          <h4 className="text-sm font-semibold mt-1.5 text-white group-hover:text-zinc-300 line-clamp-2">{p.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </footer>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
