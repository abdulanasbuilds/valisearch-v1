import matter from 'gray-matter';

// Note: In a real Vite environment, we use import.meta.glob to load markdown files
// This helper will be used by the BlogPost component
export async function getPostContent(slug: string) {
  try {
    // Vite dynamic import for markdown files
    const modules = import.meta.glob('../content/blog/posts/*.md', { as: 'raw', eager: true });
    const path = `../content/blog/posts/${slug}.md`;
    const rawContent = modules[path];

    if (!rawContent) {
      throw new Error(`Post not found: ${slug}`);
    }

    const { data, content } = matter(rawContent);
    return {
      metadata: data,
      content
    };
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}
