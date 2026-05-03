import { Link } from "react-router-dom";
import { BLOG_POSTS } from "@/content/blog";
import { JournalNavbar } from "@/components/landing/JournalNavbar";
import { JournalFooter } from "@/components/landing/JournalFooter";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Sparkles, BookOpen } from "lucide-react";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const Blog = () => {
  const sorted = [...BLOG_POSTS].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const featured = sorted[0];
  const rest = sorted.slice(1);

  // Extract unique categories
  const categories = Array.from(new Set(BLOG_POSTS.map(p => p.category)));

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <JournalNavbar />

      <main className="pt-24 pb-32">
        {/* Header Section */}
        <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-[1240px] mx-auto px-6 lg:px-10 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 sm:mb-8">
                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-zinc-300 uppercase">
                  ValiSearch Resources
                </span>
              </div>
              <h1 className="text-[40px] md:text-[80px] lg:text-[100px] font-black tracking-tighter mb-6 leading-[0.9] text-white">
                The Journal
              </h1>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                Frameworks, market intelligence, and deep dives into the mathematical art of building what matters.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              All Posts
            </button>
            {categories.map(cat => (
              <button key={cat} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post (Hero Bento) */}
        {featured && (
          <section className="max-w-[1240px] mx-auto px-6 lg:px-10 mb-20">
            <Link to={`/blog/${featured.slug}`} className="group block">
              <div className="relative rounded-[32px] md:rounded-[48px] overflow-hidden bg-zinc-900 border border-white/10 transition-all duration-700 hover:border-white/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-900 to-zinc-800" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50 transition-opacity duration-700 group-hover:opacity-80" />
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-10 p-8 md:p-16 items-center h-full">
                  <div className="order-2 lg:order-1 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">
                      <span className="text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">{featured.category}</span>
                      <span>{formatDate(featured.date)}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime} MIN READ</span>
                    </div>
                    <h2 className="text-3xl md:text-[48px] lg:text-[56px] font-black leading-[1.05] tracking-tighter mb-6 text-white group-hover:text-zinc-200 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 font-medium line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[12px] font-black text-white shadow-xl backdrop-blur-sm">
                        AA
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-white">{featured.author}</div>
                        <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Founder, VALISEARCH</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-1 lg:order-2 h-[300px] lg:h-full min-h-[400px] rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-700 ease-out flex items-center justify-center shadow-2xl">
                    <div className="absolute inset-0 bg-black/20" />
                    <Sparkles className="w-32 h-32 text-white/10" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-[120px] font-black tracking-tighter select-none uppercase -rotate-12">
                      VALISEARCH
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Bento Grid Feed */}
        <section className="max-w-[1240px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
            <h3 className="text-2xl font-black tracking-tighter text-white">Latest Entries</h3>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500 bg-white/5 px-3 py-1 rounded-full">{rest.length} Articles</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rest.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group h-full"
              >
                <Link to={`/blog/${post.slug}`} className="flex flex-col h-full bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-[32px] p-6 hover:bg-zinc-900 hover:border-white/20 transition-all duration-500">
                  <div className="aspect-[16/10] rounded-[24px] overflow-hidden bg-black/50 border border-white/5 mb-8 relative transition-all duration-500 group-hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-5xl font-black tracking-tighter select-none uppercase">
                      VS
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">
                      <span className="text-zinc-300 bg-white/5 px-2 py-1 rounded-md">{post.category}</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                    
                    <h4 className="text-2xl md:text-[28px] font-black leading-[1.1] tracking-tighter text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                    
                    <p className="text-zinc-400 text-[15px] leading-relaxed line-clamp-3 mb-8 font-medium">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[10px] font-black text-white border border-white/10">AA</div>
                        <span className="text-[12px] text-zinc-300 font-bold">{post.author}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
                         <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Substack Style Lead Gen */}
          <div className="mt-32 rounded-[32px] md:rounded-[48px] bg-zinc-900 border border-white/10 p-10 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300">Weekly Intelligence</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-[1.05]">
                Better insights for <br className="hidden md:block" />serious builders.
              </h3>
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 font-medium max-w-xl mx-auto">
                Join 5,000+ operators receiving our weekly framework teardowns and market intelligence signals.
              </p>
              <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3 p-1.5 bg-black/40 border border-white/10 rounded-2xl md:rounded-full backdrop-blur-md focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  className="flex-1 bg-transparent px-6 py-4 text-white text-sm outline-none font-medium placeholder:text-zinc-600"
                />
                <button className="px-8 py-3.5 bg-white text-black text-sm font-black rounded-xl md:rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <JournalFooter />
    </div>
  );
};

export default Blog;
