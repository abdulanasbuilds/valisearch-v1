import { Link } from "react-router-dom";
import { BLOG_POSTS } from "@/content/blog";
import { JournalNavbar } from "@/components/landing/JournalNavbar";
import { JournalFooter } from "@/components/landing/JournalFooter";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Sparkles } from "lucide-react";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const Blog = () => {
  const sorted = [...BLOG_POSTS].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#1a1a1a] selection:bg-zinc-200">
      <JournalNavbar />

      <main className="pt-24 pb-24">
        {/* Header */}
        <section className="bg-white border-b border-zinc-100 relative overflow-hidden grain-bg">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-24 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 justify-center mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-zinc-400">The Intelligence Hub</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 text-center leading-[0.9]">
                The Journal
              </h1>
              <p className="text-zinc-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed text-center">
                Deep dives into market validation, startup frameworks, and the mathematical art of building what matters.
              </p>
            </motion.div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
        </section>

        {/* Featured Post */}
        {featured && (
          <section className="border-b border-zinc-100 bg-white">
            <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-20">
              <Link to={`/blog/${featured.slug}`} className="group block">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                  <div className="lg:col-span-7">
                    <div className="aspect-[16/10] rounded-[32px] overflow-hidden shadow-2xl border border-zinc-100 transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 relative bg-zinc-50">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-white" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] text-[160px] font-black tracking-tighter select-none uppercase">
                        VALISEARCH
                      </div>
                      <div className="absolute inset-0 p-12 flex flex-col justify-between">
                         <span className="inline-block self-start text-[10px] font-black tracking-[0.3em] uppercase text-white bg-zinc-900 px-4 py-2 rounded-full shadow-xl">
                            Featured Insight
                          </span>
                          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                             <Sparkles className="w-8 h-8 text-zinc-900" />
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-6">
                      <span className="text-zinc-900 border border-zinc-200 px-3 py-1 rounded-full">{featured.category}</span>
                      <span>{formatDate(featured.date)}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-200" />
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime} MIN READ</span>
                    </div>
                    <h2 className="text-4xl md:text-[54px] font-extrabold leading-[1.02] tracking-tighter mb-8 group-hover:text-zinc-600 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-zinc-500 text-xl leading-relaxed mb-10 font-medium line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-[12px] font-black text-white shadow-xl shadow-zinc-900/10">
                          AA
                        </div>
                        <div>
                          <div className="text-[15px] font-black text-zinc-900">{featured.author}</div>
                          <div className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Founder, VALISEARCH</div>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm font-black text-zinc-900 group-hover:translate-x-1 transition-transform">
                        Read <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Bento Grid Feed */}
        <section className="max-w-[1240px] mx-auto px-6 lg:px-10 py-32">
          <div className="flex items-center justify-between mb-20 border-b border-zinc-100 pb-10">
            <h3 className="text-3xl font-extrabold tracking-tighter">Latest Entries</h3>
            <div className="flex items-center gap-4">
               <span className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-400">{rest.length} Articles</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {rest.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[16/11] rounded-[32px] overflow-hidden bg-white border border-zinc-100 mb-8 relative shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-200/50 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-4xl font-black tracking-tighter select-none uppercase">
                      VALISEARCH
                    </div>
                    <div className="absolute top-6 left-6">
                      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-900 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-black text-zinc-400 mb-5 uppercase tracking-[0.2em]">
                    <span>{formatDate(post.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-200" />
                    <span>{post.readTime} read</span>
                  </div>
                  <h4 className="text-2xl font-extrabold leading-tight tracking-tight text-[#1a1a1a] mb-5 group-hover:text-zinc-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-zinc-500 text-[16px] leading-relaxed line-clamp-2 mb-8 font-medium">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-6 border-t border-zinc-100">
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-900 border border-zinc-200">AA</div>
                    <span className="text-[13px] text-zinc-900 font-bold">{post.author}</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Substack Style Lead Gen */}
          <div className="mt-40 rounded-[48px] bg-zinc-900 p-12 md:p-24 text-center relative overflow-hidden grain-bg">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/60">Weekly Intelligence</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-8 leading-tight">
                Better insights for <br/>serious builders.
              </h3>
              <p className="text-zinc-400 text-xl leading-relaxed mb-12 font-medium">
                Join 5,000+ operators receiving our weekly framework teardowns and market intelligence signals.
              </p>
              <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4 p-2 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  className="flex-1 bg-transparent px-6 py-4 text-white text-base outline-none font-medium placeholder:text-zinc-600"
                />
                <button className="px-10 py-4 bg-white text-black text-base font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl">
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
