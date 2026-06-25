import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { Sidebar } from "@/components/sidebar";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} の記事`,
    description: `タグ「${decoded}」が付いた記事の一覧`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="space-y-8">
        <Link
          href="/tags"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> タグ一覧へ
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-muted-foreground">#</span>
          {decoded}
        </h1>
        <p className="text-sm text-muted-foreground">{posts.length}件の記事</p>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
