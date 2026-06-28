import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  tags: string[];
  cover?: string; // /images/... のパス（任意）
  readingTime: number; // 分
  draft: boolean; // true なら下書き（一覧・sitemap・直URL すべてから除外）
};

export type Post = PostMeta & { content: string };

export type Heading = { depth: number; text: string; slug: string };

export type TagCount = { tag: string; count: number };

// 日本語主体の本文向けの概算読了時間（分）。
function calcReadingTime(content: string): number {
  const chars = content.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

function readPostFile(slug: string): Post {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date
      ? new Date(data.date).toISOString().slice(0, 10)
      : "1970-01-01",
    tags: data.tags ?? [],
    cover: data.cover,
    readingTime: calcReadingTime(content),
    draft: data.draft === true,
    content,
  };
}

// frontmatter の draft フラグだけを軽量に判定する。
function isDraft(slug: string): boolean {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const { data } = matter(fs.readFileSync(fullPath, "utf8"));
  return data.draft === true;
}

// 公開対象の slug 一覧。下書き(draft: true)は除外する。
// ここで除外することで、一覧・タグ・sitemap・generateStaticParams(記事生成)・
// 直URLアクセス(404)まで一括で下書きが非公開になる。
export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter((slug) => !isDraft(slug));
}

export function getPostBySlug(slug: string): Post {
  return readPostFile(slug);
}

export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const { content: _content, ...meta } = readPostFile(slug);
      void _content;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 全タグを件数の多い順に集計。
export function getAllTags(): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

// 本文(Markdown)から h2 / h3 見出しを抽出。slug は rehype-slug と揃える。
export function getHeadings(content: string): Heading[] {
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  for (const line of withoutCode.split("\n")) {
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length;
    const text = m[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim();
    headings.push({ depth, text, slug: slugger.slug(text) });
  }
  return headings;
}

// 前後（新しい/古い）の記事を返す。一覧は新しい順。
export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null; // より新しい記事
  next: PostMeta | null; // より古い記事
} {
  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? posts[i - 1] : null,
    next: i < posts.length - 1 ? posts[i + 1] : null,
  };
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
