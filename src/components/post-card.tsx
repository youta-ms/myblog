import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate, type PostMeta } from "@/lib/posts";
import { withBasePath } from "@/lib/utils";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <Card className="group overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
        {post.cover && (
          <div className="aspect-[2/1] overflow-hidden border-b bg-muted">
            {/* biome-ignore lint/performance/noImgElement: static export card thumbnail */}
            <img
              src={
                post.cover.startsWith("/")
                  ? withBasePath(post.cover)
                  : post.cover
              }
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>約{post.readingTime}分</span>
          </div>
          <h3 className="font-bold text-xl leading-snug tracking-tight">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-muted-foreground text-sm">
            {post.description}
          </p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  #{t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
