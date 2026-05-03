// Browser-compatible markdown loader with simple YAML frontmatter parser.
// Avoids gray-matter (which depends on Node's Buffer).

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const [, yaml, content] = match;
  const data: Record<string, string> = {};
  for (const line of yaml.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    let value: string = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return { data, content };
}

export async function getPostContent(slug: string) {
  try {
    const modules = import.meta.glob("../content/blog/posts/*.md", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;
    const path = `../content/blog/posts/${slug}.md`;
    const raw = modules[path];
    if (!raw) throw new Error(`Post not found: ${slug}`);
    const { data, content } = parseFrontmatter(raw);
    return { metadata: data, content };
  } catch (error) {
    console.error("Error loading blog post:", error);
    return null;
  }
}
