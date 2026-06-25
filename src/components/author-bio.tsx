import { Avatar } from "@/components/avatar";
import { BrandIcon } from "@/components/icons";
import { author } from "@/lib/author";

export function AuthorBio() {
  return (
    <aside className="flex gap-4 rounded-lg border bg-muted/30 p-5">
      <Avatar size={56} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="font-bold">{author.name}</p>
          <p className="text-muted-foreground text-sm">{author.role}</p>
        </div>
        <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
          {author.bio}
        </p>
        <div className="mt-3 flex gap-3">
          {author.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <BrandIcon icon={link.icon} className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
