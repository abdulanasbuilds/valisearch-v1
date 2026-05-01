import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { getPostContent } from "@/lib/blog";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<{ metadata: any; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (slug) {
        const data = await getPostContent(slug);
        setPost(data);
        
        // Update document title for SEO
        if (data) {
          document.title = `${data.metadata.title} | ValiSearch Blog`;
        }
      }
      setIsLoading(false);
    }
    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-blue-400 hover:underline">Back to blog</Link>
      </div>
    );
  }

  const { metadata, content } = post;

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-zinc-800">
      <Navbar />

      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          <header className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 mb-6 uppercase tracking-[0.2em]">
                <span className="text-white bg-zinc-800 px-2 py-1 rounded">{metadata.category}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <div className="flex items-center gap-1.5">
                  {new Date(metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-8">
                {metadata.title}
              </h1>

              <div className="flex items-center gap-4 py-8 border-y border-white/5 relative">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                  <span className="text-white font-bold text-lg">AA</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{metadata.author}</div>
                  <div className="text-xs text-zinc-500 font-medium">Founder & Builder • Written for humans</div>
                </div>
                {/* Organic accent */}
                <svg className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 hidden md:block" width="100" height="40" viewBox="0 0 100 40">
                  <path d="M0 20 Q 25 10, 50 20 T 100 20" fill="none" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            </motion.div>
          </header>

          <div className="prose prose-invert prose-zinc max-w-none 
            prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-zinc-400 prose-p:leading-[1.8] prose-p:text-lg
            prose-strong:text-white prose-strong:font-bold
            prose-blockquote:border-l-white prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
            prose-a:text-white prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-zinc-300
            prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-300 before:prose-code:content-[''] after:prose-code:content-['']
            prose-li:text-zinc-400
          ">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <footer className="mt-24 pt-12 border-t border-white/5">
            <div className="p-10 md:p-16 rounded-[40px] border border-white/10 bg-zinc-900/30 backdrop-blur-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Tired of guessing?</h3>
                <p className="text-zinc-400 mb-10 max-w-lg text-lg leading-relaxed">
                  We built a tool that does the macro-validation for you in 30 seconds. Same frameworks the pros use, minus the $50k consulting fee.
                </p>
                
                <Link 
                  to="/analyze" 
                  className="inline-flex items-center gap-4 bg-white text-black font-bold px-10 py-5 rounded-2xl hover:bg-zinc-200 transition-all text-sm uppercase tracking-widest"
                >
                  Analyze my idea
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              {/* Hand-drawn style background element */}
              <div className="absolute -bottom-10 -right-10 opacity-5">
                <svg width="300" height="300" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 5" />
                  <path d="M20 100 Q 100 0, 180 100 T 20 100" fill="none" stroke="white" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
