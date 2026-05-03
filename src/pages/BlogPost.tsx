import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { JournalNavbar } from "@/components/landing/JournalNavbar";
import { JournalFooter } from "@/components/landing/JournalFooter";
import { getPostContent } from "@/lib/blog";
import { BLOG_POSTS } from "@/content/blog";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Clock, Sparkles, Share2, Linkedin, ChevronRight, Play, Bookmark, BookOpen } from "lucide-react";

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    let cancelled = false;
    async function loadPost() {
      if (!slug) return;
      setIsLoading(true);
      window.scrollTo(0, 0);
      const data = await getPostContent(slug);
      if (cancelled) return;
      setPost(data);
      if (data) {
        document.title = `${data.metadata.title} | VALISEARCH Journal`;
        // Basic SEO meta tags
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', data.metadata.excerpt || 'ValiSearch Journal Article');
      }
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

  useEffect(() => {
    if (!post) return;
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 400);
      const headings = articleRef.current?.querySelectorAll<HTMLElement>("h2, h3");
      if (!headings) return;
      let current = "";
      headings.forEach((h) => {
        const top = h.getBoundingClientRect().top;
        if (top < 200) current = h.id;
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
        <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col items-center justify-center p-6 font-sans">
        <h1 className="text-3xl font-black tracking-tighter mb-4">Article not found</h1>
        <Link to="/blog" className="text-zinc-400 hover:text-white underline font-medium">Return to Journal</Link>
      </div>
    );
  }

  const { metadata, content } = post;
  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  const readMins = parseInt(String(metadata.readTime || "5")) || 5;

  const paragraphs = content.split(/\n\n+/);
  const midIdx = Math.floor(paragraphs.length / 2);
  const partA = paragraphs.slice(0, midIdx).join("\n\n");
  const partB = paragraphs.slice(midIdx).join("\n\n");

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-zinc-800 selection:text-white relative">
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <JournalNavbar />
      
      {/* Reading Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-[110]"
        style={{ scaleX }}
      />

      {/* Sticky Secondary Nav */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl h-14"
          >
            <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between gap-8">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 shrink-0 hidden md:inline">Reading:</span>
                <p className="text-sm font-bold truncate text-zinc-300">{metadata.title}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <Share2 className="w-4 h-4" />
                </button>
                <Link to="/register">
                  <button className="px-4 py-1.5 bg-white text-black text-[11px] font-black uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    Validate Idea
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-32">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-12">
            <Link to="/blog" className="hover:text-white transition-colors flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Journal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white truncate max-w-[200px] sm:max-w-[300px]">{metadata.title}</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-16 relative">
            {/* Article Content */}
            <article className="lg:pr-10">
              <header className="mb-16">
                <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] font-black text-zinc-500 mb-8 uppercase tracking-[0.2em]">
                  <span className="text-white bg-white/10 border border-white/5 px-3 py-1 rounded-full">{metadata.category}</span>
                  <span>{new Date(metadata.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{readMins} MIN READ</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black leading-[1.05] tracking-tighter mb-10 text-white">
                  {metadata.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-10">
                   <button className="flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-zinc-200 text-black rounded-full text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      <Play className="w-3.5 h-3.5 fill-current" /> Listen
                   </button>
                   <button onClick={handleShare} className="flex items-center gap-2.5 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all">
                      <Share2 className="w-3.5 h-3.5" /> Share
                   </button>
                   <button className="p-3 border border-white/10 rounded-full hover:bg-white/5 transition-all text-zinc-400 hover:text-white">
                      <Bookmark className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="flex items-center justify-between py-8 border-y border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-sm font-black text-white shadow-xl backdrop-blur-sm">AA</div>
                    <div>
                      <a href="https://www.linkedin.com/in/abdul-anas-0161b3370" target="_blank" rel="noopener noreferrer" className="text-[15px] font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-2">
                        {metadata.author} <Linkedin className="w-3 h-3 text-[#0077b5]" />
                      </a>
                      <div className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Founder, VALISEARCH</div>
                    </div>
                  </div>
                </div>
              </header>

              <div ref={articleRef} className="prose prose-invert prose-zinc max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-h2:text-3xl prose-h3:text-2xl prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-lg prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-zinc-400">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      return <h2 id={slugify(text)} className="scroll-mt-24">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      return <h3 id={slugify(text)} className="scroll-mt-24">{children}</h3>;
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 bg-white/5 p-6 rounded-r-2xl not-prose my-12 text-xl font-medium text-white italic">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {partA}
                </ReactMarkdown>

                {/* Mid-Article CTA (Bento Glassmorphism) */}
                <aside className="not-prose my-20 rounded-[32px] bg-zinc-900 border border-white/10 p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50 transition-opacity duration-1000 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/5 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-[10px] font-black tracking-[0.4em] uppercase text-blue-400 mb-4">Technical Intelligence</p>
                    <h4 className="text-3xl md:text-[40px] font-black tracking-tighter text-white mb-6 leading-[1.05]">
                      Stop guessing. <br className="hidden md:block"/>Start validating.
                    </h4>
                    <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl font-medium">
                      ValiSearch uses this exact framework to analyze market signals, competitors, and revenue models for your idea in under 60 seconds.
                    </p>
                    <Link to="/register">
                      <button className="px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-3">
                        Analyze Your Idea <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </aside>

                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      return <h2 id={slugify(text)} className="scroll-mt-24">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      return <h3 id={slugify(text)} className="scroll-mt-24">{children}</h3>;
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-500 bg-white/5 p-6 rounded-r-2xl not-prose my-12 text-xl font-medium text-white italic">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {partB}
                </ReactMarkdown>
              </div>

              {/* Author Footer */}
              <footer className="mt-24 pt-16 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-start gap-8 bg-zinc-900 border border-white/5 p-10 rounded-[32px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                    <Linkedin className="w-32 h-32 text-white" />
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-2xl">AA</div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white mb-3 tracking-tight">Written by {metadata.author}</h3>
                    <p className="text-base text-zinc-400 leading-relaxed mb-6 font-medium">
                      Founder of VALISEARCH. Builder of AI tools for startup validation and market intelligence. Passionate about helping operators ship products that actually matter.
                    </p>
                    <a href="https://www.linkedin.com/in/abdul-anas-0161b3370" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">
                      <Linkedin className="w-4 h-4 text-[#0077b5]" /> Follow on LinkedIn
                    </a>
                  </div>
                </div>

                {/* Related Posts */}
                {related.length > 0 && (
                  <div className="mt-24">
                    <div className="flex items-center justify-between mb-10">
                       <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-500">Related Entries</h3>
                       <Link to="/blog" className="text-[11px] font-black tracking-widest uppercase text-white hover:text-blue-400 transition-colors">View All</Link>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                      {related.map((p) => (
                        <Link key={p.slug} to={`/blog/${p.slug}`} className="group block bg-zinc-900/50 p-4 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300">
                          <div className="aspect-[16/10] rounded-2xl bg-black border border-white/5 mb-5 transition-all group-hover:shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-2xl font-black uppercase tracking-tighter">VS</div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-500 mb-2 block">{p.category}</span>
                          <h4 className="text-sm font-bold tracking-tight text-white group-hover:text-blue-400 leading-snug line-clamp-2 transition-colors">{p.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </footer>
            </article>

            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-40 space-y-12">
                <div>
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-6">Navigation</p>
                  <nav className="space-y-4 border-l border-white/10">
                    {toc.map((item) => (
                      <a
                         key={item.id}
                         href={`#${item.id}`}
                         className={`block text-[13px] leading-snug pl-4 -ml-px transition-all duration-300 border-l-2 ${
                           item.level === 3 ? "pl-8 text-[12px]" : ""
                         } ${
                           activeId === item.id
                             ? "border-blue-500 text-white font-bold"
                             : "border-transparent text-zinc-500 hover:text-zinc-300 font-medium"
                         }`}
                      >
                         {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
                
                <div className="pt-10 border-t border-white/10">
                  <Link to="/register" className="group block p-6 rounded-3xl bg-zinc-900 border border-white/10 transition-all hover:bg-zinc-800 hover:border-white/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Sparkles className="w-12 h-12 text-blue-400" />
                    </div>
                    <p className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-3">Intelligence</p>
                    <p className="text-[14px] font-bold leading-tight text-white mb-6">Validate your idea with the VALISEARCH engine.</p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-blue-400 flex items-center gap-2 group-hover:gap-3 transition-all">
                      Analyze Now <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <JournalFooter />
    </div>
  );
};

export default BlogPost;
