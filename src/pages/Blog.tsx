import { Link } from "react-router-dom";
import { BLOG_POSTS } from "@/content/blog";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const Blog = () => {
  const sorted = [...BLOG_POSTS].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white selection:bg-zinc-800">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Editorial header */}
        <section className="border-b border-white/5">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-10 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-3">
                ValiSearch · Insights
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                The Builder's Journal
              </h1>
            </div>
            <p className="text-zinc-400 max-w-md text-[15px] leading-relaxed">
              Frameworks, teardowns and field notes on validating, launching and growing
              software businesses — written for operators, not influencers.
            </p>
          </div>
        </section>

        {/* Featured */}
        {featured && (
          <section className="border-b border-white/5">
            <Link
              to={`/blog/${featured.slug}`}
              className="block max-w-[1240px] mx-auto px-6 lg:px-10 py-14 group"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-12 gap-10 items-center"
              >
                <div className="lg:col-span-7 relative">
                  <div className="aspect-[16/10] rounded-[12px] overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] relative">
                    <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                      style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/80 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
                        Featured · {featured.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-5">
                    <span>{formatDate(featured.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" />{featured.readTime}</span>
                  </div>
                  <h2 className="text-3xl md:text-[40px] font-bold leading-[1.1] tracking-tight mb-5 group-hover:text-zinc-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-400 text-[17px] leading-[1.7] mb-7" style={{ fontFamily: "'Source Serif 4', serif" }}>
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-[11px] font-bold">
                      AA
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{featured.author}</div>
                      <div className="text-xs text-zinc-500">Founder, ValiSearch</div>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                      Read article <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </section>
        )}

        {/* Feed */}
        <section className="max-w-[1240px] mx-auto px-6 lg:px-10 pt-16">
          <div className="flex items-end justify-between mb-10">
            <h3 className="text-xl font-semibold tracking-tight">Latest articles</h3>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-500">{rest.length} posts</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {rest.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[16/10] rounded-[10px] overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/5 mb-5 relative shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]">
                    <div className="absolute inset-0 opacity-[0.05]"
                      style={{ backgroundImage: "linear-gradient(135deg, transparent 49%, rgba(255,255,255,0.4) 50%, transparent 51%)", backgroundSize: "8px 8px" }} />
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded border border-white/10">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 mb-3">
                    <span>{formatDate(post.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="text-[19px] font-semibold leading-snug tracking-tight text-white mb-3 group-hover:text-zinc-300 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-5" style={{ fontFamily: "'Source Serif 4', serif" }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold">AA</div>
                    <span className="text-xs text-zinc-400 font-medium">{post.author}</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-24 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-lg">
              <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-3">Newsletter</p>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                Get the next teardown in your inbox.
              </h3>
              <p className="text-zinc-400 text-[15px] leading-relaxed">
                One sharp essay per week on validation, distribution, and shipping. No fluff. Unsubscribe anytime.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="flex-1 md:w-72 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
              />
              <button className="px-5 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
