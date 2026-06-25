import type { Heading } from "@/lib/posts";

export function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;
  return (
    <nav
      aria-label="目次"
      className="rounded-lg border bg-muted/30 p-4 text-sm"
    >
      <p className="mb-2 font-semibold">目次</p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.slug} className={h.depth === 3 ? "ml-4" : undefined}>
            <a
              href={`#${h.slug}`}
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
