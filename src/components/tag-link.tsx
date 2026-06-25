import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function TagLink({ tag }: { tag: string }) {
  return (
    <Link href={`/tags/${encodeURIComponent(tag)}`}>
      <Badge
        variant="secondary"
        className="transition-colors hover:bg-secondary/60"
      >
        #{tag}
      </Badge>
    </Link>
  );
}
