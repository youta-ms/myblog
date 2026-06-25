import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "タグ一覧",
  description: "タグから記事を探す",
};

export default function TagsPage() {
  const tags = getAllTags();
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> ホームへ
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">タグ一覧</h1>
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm transition-colors hover:bg-secondary/60"
              >
                #{tag}
                <span className="ml-1.5 text-muted-foreground">{count}</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
