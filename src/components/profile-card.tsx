import { Avatar } from "@/components/avatar";
import { BrandIcon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { author } from "@/lib/author";

export function ProfileCard() {
  return (
    <Card className="p-5">
      <div className="flex flex-col items-center text-center">
        <Avatar size={64} />
        <p className="mt-3 font-bold">{author.name}</p>
        <p className="text-muted-foreground text-sm">{author.role}</p>
        <p className="mt-3 text-left text-muted-foreground text-sm leading-relaxed">
          {author.bio}
        </p>
        <div className="mt-4 flex gap-3">
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
    </Card>
  );
}
