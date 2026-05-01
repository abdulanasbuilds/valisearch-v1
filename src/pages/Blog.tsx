import { Link } from "react-router-dom";
import { BLOG_POSTS } from "@/content/blog";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-zinc-800">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="section-container max-w-5xl mx-auto px-6">
          <header className="mb-24 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
                The <span className="text-zinc-600">Builder's</span> Diary.
              </h1>
              <p className="text-xl text-zinc-400 max-w-xl leading-relaxed font-medium">
                Hard truths about validation, building, and scaling in public. No fluff, just the "dirty" reality.
              </p>
            </motion.div>
            {/* Hand-drawn accent */}
            <svg className="absolute -bottom-8 left-0 opacity-10" width="200" height="20" viewBox="0 0 200 20">
              <path d="M0 10 Q 50 0, 100 10 T 200 10" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          </header>

          <div className="grid gap-16 md:grid-cols-2">
            {BLOG_POSTS.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative flex flex-col"
              >
                <Link to={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
                
                <div className="relative aspect-[4/3] mb-8 overflow-hidden rounded-[32px] border border-white/5 bg-zinc-900 group-hover:border-white/10 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                    <div className="text-zinc-700/50 font-black text-6xl uppercase tracking-tighter select-none rotate-12">
                      {post.category}
                    </div>
                  </div>
                  {/* Grainy texture or organic overlay */}
                  <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay" />
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                <div className="flex items-center gap-6 text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-[0.2em]">
                  <span className="text-white px-2 py-1 bg-white/5 rounded">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    {post.readTime}
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-6 group-hover:text-zinc-300 transition-colors leading-[1.1] tracking-tight">
                  {post.title}
                </h2>
                
                <p className="text-zinc-500 text-lg leading-relaxed mb-8 line-clamp-2 font-medium">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest">
                  Read story 
                  <div className="w-10 h-[1px] bg-white group-hover:w-16 transition-all duration-500" />
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter / CTA */}
          <div className="mt-40 p-12 md:p-20 rounded-[48px] border border-white/5 bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-zinc-800/20 blur-[120px] rounded-full" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">Build in public.</h3>
                <p className="text-xl text-zinc-500 mb-0 leading-relaxed font-medium">
                  Join 2,000+ humans who get our unfiltered weekly letters on strategy and growth.
                </p>
              </div>
              
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Your personal email" 
                  className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/20 transition-colors font-medium"
                />
                <button className="bg-white text-black font-black px-10 py-4 rounded-2xl hover:bg-zinc-200 transition-all uppercase tracking-widest text-xs">
                  Join us
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
