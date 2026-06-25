import { author } from "@/lib/author";
import { withBasePath } from "@/lib/utils";

export function Avatar({ size = 48 }: { size?: number }) {
  if (author.avatar) {
    const src = author.avatar.startsWith("/")
      ? withBasePath(author.avatar)
      : author.avatar;
    return (
      // biome-ignore lint/performance/noImgElement: small static avatar
      <img
        src={src}
        alt={author.name}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-brand/15 font-bold text-brand"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {author.initials}
    </span>
  );
}
