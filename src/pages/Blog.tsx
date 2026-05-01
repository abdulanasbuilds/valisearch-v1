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
          <header className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Insights for <span className="text-zinc-500">Builders.</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
                Practical guides, market deep-dives, and founder stories to help you build with more certainty and less noise.
              </p>
            </motion.div>
          </header>

          <div className="grid gap-12 md:grid-cols-2">
            {BLOG_POSTS.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative flex flex-col"
              >
                <Link to={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
                
                <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 group-hover:border-white/10 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                    <span className="text-zinc-700 font-bold text-xl uppercase tracking-[0.2em]">{post.category}</span>
                  </div>
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-300">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-zinc-300 transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-white">
                  Read article 
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter / CTA */}
          <div className="mt-32 p-8 md:p-12 rounded-[32px] border border-white/5 bg-zinc-900/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10 max-w-xl">
              <h3 className="text-2xl font-bold mb-4">Never miss an insight.</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Join 2,000+ founders who get our weekly teardowns of successful startups and validation frameworks.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-colors"
                />
                <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-all">
                  Subscribe
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
