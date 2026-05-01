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
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 mb-6 uppercase tracking-widest">
                <span className="text-blue-400">{metadata.category}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {metadata.readTime}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-8">
                {metadata.title}
              </h1>

              <div className="flex items-center gap-3 py-6 border-y border-white/5">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{metadata.author}</div>
                  <div className="text-xs text-zinc-500">Founder @ ValiSearch</div>
                </div>
              </div>
            </motion.div>
          </header>

          <div className="prose prose-invert prose-zinc max-w-none 
            prose-headings:font-black prose-headings:tracking-tight
            prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-lg
            prose-strong:text-white prose-strong:font-bold
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-code:bg-zinc-900 prose-code:px-1 prose-code:rounded prose-code:text-blue-300
            prose-li:text-zinc-400
          ">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <footer className="mt-24 pt-12 border-t border-white/5">
            <div className="p-8 md:p-12 rounded-[32px] border border-blue-500/20 bg-blue-500/[0.03] backdrop-blur-sm relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
              
              <h3 className="text-3xl font-black mb-4 tracking-tight">Stop guessing. Start building.</h3>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto text-lg">
                Run your idea through 7 specialized AI frameworks in 30 seconds. Get the certainty you need to go all-in.
              </p>
              
              <Link 
                to="/analyze" 
                className="inline-flex items-center gap-3 bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-zinc-200 transition-all uppercase tracking-widest text-[13px]"
              >
                Validate my idea
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
