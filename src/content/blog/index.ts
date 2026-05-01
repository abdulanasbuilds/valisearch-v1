export interface BlogPostMetadata {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  image?: string;
}

export const BLOG_POSTS: BlogPostMetadata[] = [
  {
    title: "How to Validate a Startup Idea in 2026 (Without Spending Money)",
    slug: "how-to-validate-startup-idea-2026",
    date: "2026-04-20",
    excerpt: "Most founders build for months before discovering nobody wants their product. Here is how to know in 72 hours — for free.",
    author: "Abdul Anas",
    readTime: "9 min read",
    category: "Validation",
  }
];
