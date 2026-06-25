import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags().slice(0, 6);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="space-y-12">
        {/* ヒーロー */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-10">
          <div
            aria-hidden
            className="-right-16 -top-16 absolute size-48 rounded-full bg-brand/20 blur-3xl"
          />
          <p className="font-medium text-brand text-sm">Web Engineer's Blog</p>
          <h1 className="mt-2 text-balance font-bold text-4xl tracking-tight sm:text-5xl">
            ひなたの技術メモ
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
            Web開発を中心に、学んだことや試したことを記録しています。
            フロントエンド、インフラ、設計の話題が中心です。
          </p>
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map(({ tag }) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="secondary"
                    className="transition-colors hover:bg-secondary/60"
                  >
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 記事一覧 */}
        <section className="space-y-4">
          <h2 className="font-bold text-2xl tracking-tight">記事一覧</h2>
          {posts.length === 0 ? (
            <p className="text-muted-foreground">まだ記事がありません。</p>
          ) : (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </section>
      </div>

      <Sidebar />
    </div>
  );
}
