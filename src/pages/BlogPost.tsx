import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { JournalNavbar } from "@/components/landing/JournalNavbar";
import { JournalFooter } from "@/components/landing/JournalFooter";
import { getPostContent } from "@/lib/blog";
import { BLOG_POSTS } from "@/content/blog";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Clock, Sparkles, Share2, Linkedin, ChevronRight, Play, Headphones, Bookmark } from "lucide-react";

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
      const data = await getPostContent(slug);
      if (cancelled) return;
      setPost(data);
      if (data) document.title = `${data.metadata.title} | VALISEARCH Journal`;
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
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white min-h-screen text-zinc-900 flex flex-col items-center justify-center p-6 font-['Inter']">
        <h1 className="text-3xl font-bold mb-3">Article not found</h1>
        <Link to="/blog" className="text-zinc-500 hover:text-zinc-900 underline font-medium">Back to journal</Link>
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
    <div className="bg-white min-h-screen text-[#1a1a1a] selection:bg-zinc-100">
      <JournalNavbar />
      
      {/* Reading Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 origin-left z-[110]"
        style={{ scaleX }}
      />

      {/* Sticky Secondary Nav */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md h-14"
          >
            <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between gap-8">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">Reading:</span>
                <p className="text-sm font-bold truncate">{metadata.title}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button onClick={handleShare} className="p-2 hover:bg-zinc-50 rounded-full transition-colors text-zinc-400 hover:text-zinc-900">
                  <Share2 className="w-4 h-4" />
                </button>
                <Link to="/register">
                  <button className="px-4 py-1.5 bg-zinc-900 text-white text-[11px] font-bold rounded-full hover:bg-zinc-800 transition-all">
                    Analyze Idea
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
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-12">
            <Link to="/blog" className="hover:text-zinc-900">Journal</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-900 truncate max-w-[200px]">{metadata.title}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 relative">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-40 space-y-12">
                <div>
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-8">Navigation</p>
                  <nav className="space-y-5 border-l border-zinc-100">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-[13px] leading-snug pl-5 -ml-px transition-all duration-300 border-l-2 ${
                          item.level === 3 ? "pl-9" : ""
                        } ${
                          activeId === item.id
                            ? "border-zinc-900 text-zinc-900 font-bold"
                            : "border-transparent text-zinc-400 hover:text-zinc-600 font-medium"
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
                
                <div className="pt-10 border-t border-zinc-100">
                  <Link to="/register" className="group block p-6 rounded-2xl bg-zinc-50 border border-zinc-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <Sparkles className="w-12 h-12" />
                    </div>
                    <p className="text-[9px] font-black tracking-widest uppercase text-zinc-400 mb-3">Intelligence</p>
                    <p className="text-[14px] font-bold leading-tight text-zinc-900 mb-4">Validate your idea with the VALISEARCH engine.</p>
                    <span className="text-[11px] font-bold text-zinc-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Analyze Now <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Article */}
            <article className="lg:col-span-9 xl:col-span-8 xl:col-start-4">
              <header className="mb-20">
                <div className="flex items-center gap-3 text-[11px] font-black text-zinc-400 mb-10 uppercase tracking-[0.3em]">
                  <span className="text-zinc-900 bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-full">{metadata.category}</span>
                  <span>{new Date(metadata.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-200" />
                  <span className="inline-flex items-center gap-1.5 font-bold"><Clock className="w-3.5 h-3.5" />{readMins} MIN READ</span>
                </div>
                
                <h1 className="text-4xl md:text-[64px] font-extrabold leading-[1.02] tracking-tighter mb-12 kinetic-hover">
                  {metadata.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mb-12">
                   <button className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-full text-[13px] font-bold text-zinc-900 transition-all active:scale-95">
                      <Play className="w-3.5 h-3.5 fill-current" /> Listen to Article
                   </button>
                   <button className="p-2.5 border border-zinc-200 rounded-full hover:bg-zinc-50 transition-all">
                      <Bookmark className="w-4 h-4 text-zinc-400 hover:text-zinc-900" />
                   </button>
                </div>
                
                <div className="flex items-center justify-between gap-6 py-10 border-y border-zinc-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-lg font-black text-white shadow-xl shadow-zinc-900/10">AA</div>
                    <div>
                      <a href="https://www.linkedin.com/in/abdul-anas-0161b3370" target="_blank" rel="noopener noreferrer" className="text-[16px] font-bold text-zinc-900 hover:underline flex items-center gap-2">
                        {metadata.author} <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                      </a>
                      <div className="text-[13px] font-medium text-zinc-500">Founder, VALISEARCH</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 border border-zinc-100 rounded-lg text-[11px] font-black text-zinc-400 hover:text-zinc-900 hover:border-zinc-200 transition-all uppercase tracking-widest">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
              </header>

              <div ref={articleRef} className="article-prose max-w-[700px] mx-auto">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      return <h2 id={slugify(text)} className="kinetic-hover">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      return <h3 id={slugify(text)} className="kinetic-hover">{children}</h3>;
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="key-takeaway not-prose my-12">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {partA}
                </ReactMarkdown>

                {/* Bento Style CTA */}
                <aside className="not-prose my-20 rounded-[32px] glass-panel bg-white border border-zinc-100 p-10 md:p-14 shadow-2xl shadow-zinc-200/40 relative overflow-hidden group grain-bg">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-bl-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125 opacity-50" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-[20px] bg-zinc-900 flex items-center justify-center mb-10 shadow-2xl shadow-zinc-900/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[11px] font-black tracking-[0.4em] uppercase text-zinc-400 mb-5">Technical Intelligence</p>
                    <h4 className="text-3xl md:text-[42px] font-extrabold tracking-tighter text-zinc-900 mb-6 leading-none">
                      Stop guessing. <br/>Start validating.
                    </h4>
                    <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-xl font-medium">
                      VALISEARCH uses this exact framework to analyze market signals, competitors, and revenue models for your idea in under 60 seconds.
                    </p>
                    <Link to="/register">
                      <button className="px-10 py-5 bg-zinc-900 text-white font-black text-base rounded-full hover:bg-zinc-800 transition-all active:scale-95 shadow-2xl shadow-zinc-900/20 flex items-center gap-3">
                        Analyze Your Idea <ArrowUpRight className="w-6 h-6" />
                      </button>
                    </Link>
                  </div>
                </aside>

                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      return <h2 id={slugify(text)} className="kinetic-hover">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      return <h3 id={slugify(text)} className="kinetic-hover">{children}</h3>;
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="key-takeaway not-prose my-12">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {partB}
                </ReactMarkdown>
              </div>

              {/* Author Footer */}
              <footer className="mt-32 pt-20 border-t border-zinc-100">
                <div className="flex flex-col md:flex-row items-start gap-10 bg-zinc-50 p-12 rounded-[32px] border border-zinc-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Linkedin className="w-24 h-24" />
                  </div>
                  <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-2xl rotate-2">AA</div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-extrabold text-zinc-900 mb-4 tracking-tight">Written by {metadata.author}</h3>
                    <p className="text-lg text-zinc-600 leading-relaxed mb-8 font-medium">
                      Founder of VALISEARCH. Builder of AI tools for startup validation and market intelligence. Passionate about helping operators ship products that actually matter.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <a href="https://www.linkedin.com/in/abdul-anas-0161b3370" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-900 hover:border-zinc-900 hover:shadow-xl transition-all shadow-sm">
                        <Linkedin className="w-5 h-5 text-[#0077b5]" /> Follow on LinkedIn
                      </a>
                    </div>
                  </div>
                </div>

                {/* Related Posts */}
                {related.length > 0 && (
                  <div className="mt-32">
                    <div className="flex items-center justify-between mb-12">
                       <h3 className="text-[11px] font-black tracking-[0.4em] uppercase text-zinc-400">Related Entries</h3>
                       <Link to="/blog" className="text-[11px] font-black tracking-widest uppercase text-zinc-900 hover:underline">View All</Link>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-10">
                      {related.map((p) => (
                        <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                          <div className="aspect-[16/10] rounded-2xl bg-zinc-50 border border-zinc-100 mb-6 transition-all group-hover:shadow-2xl group-hover:shadow-zinc-200/50 overflow-hidden relative group-hover:-translate-y-1">
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] text-2xl font-black uppercase tracking-tighter">VALISEARCH</div>
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-3 block">{p.category}</span>
                          <h4 className="text-base font-extrabold tracking-tight text-zinc-900 group-hover:text-zinc-600 leading-snug line-clamp-2">{p.title}</h4>
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

      <JournalFooter />
    </div>
  );
};

export default BlogPost;
