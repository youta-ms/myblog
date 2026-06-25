import Link from "next/link";
import { ProfileCard } from "@/components/profile-card";
import { Badge } from "@/components/ui/badge";
import { getAllTags } from "@/lib/posts";

export function Sidebar() {
  const tags = getAllTags().slice(0, 10);
  return (
    <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
      <ProfileCard />
      {tags.length > 0 && (
        <div className="rounded-xl border p-5">
          <p className="mb-3 font-semibold text-sm">タグ</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                <Badge
                  variant="secondary"
                  className="transition-colors hover:bg-secondary/60"
                >
                  #{tag}
                  <span className="ml-1 text-muted-foreground">{count}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
