import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { AuthorBio } from "@/components/author-bio";
import { mdxComponents } from "@/components/mdx";
import { TagLink } from "@/components/tag-link";
import { Toc } from "@/components/toc";
import {
  formatDate,
  getAdjacentPosts,
  getAllSlugs,
  getHeadings,
  getPostBySlug,
} from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return { title: post.title, description: post.description };
  } catch {
    return {};
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getAllSlugs().includes(slug)) notFound();
  const post = getPostBySlug(slug);
  const headings = getHeadings(post.content);
  const { prev, next } = getAdjacentPosts(slug);

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: ["heading-anchor"],
                ariaHidden: true,
                tabIndex: -1,
              },
              content: { type: "text", value: "#" },
            },
          ],
          [rehypePrettyCode, { theme: "github-dark" }],
        ],
      },
    },
  });

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> 記事一覧へ
      </Link>

      <header className="space-y-3 border-b pb-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />約{post.readingTime}分
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <TagLink key={t} tag={t} />
            ))}
          </div>
        )}
      </header>

      <Toc headings={headings} />

      <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-brand prose-a:underline-offset-2 hover:prose-a:text-brand/80 prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-brand prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-muted-foreground prose-img:rounded-lg">
        {content}
      </div>

      <AuthorBio />

      {(prev || next) && (
        <nav className="grid gap-4 border-t pt-6 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/posts/${prev.slug}`}
              className="group rounded-lg border p-4 transition-colors hover:bg-accent/40"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5" /> 新しい記事
              </span>
              <span className="mt-1 block font-medium group-hover:underline">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/posts/${next.slug}`}
              className="group rounded-lg border p-4 text-right transition-colors hover:bg-accent/40"
            >
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                古い記事 <ArrowRight className="size-3.5" />
              </span>
              <span className="mt-1 block font-medium group-hover:underline">
                {next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
