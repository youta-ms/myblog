import NextImage, { type ImageProps } from "next/image";
import type { ComponentProps } from "react";
import { Pre } from "@/components/code-block";
import { withBasePath } from "@/lib/utils";

// Markdown / MDX の画像にスタイルと basePath を付与する。
// GitHub Pages のサブパス配信では "/images/x.png" のような絶対パスに
// basePath を足さないと 404 になるため、ここで吸収する。
function MdxImg({ src, alt, ...props }: ComponentProps<"img">) {
  const resolved =
    typeof src === "string" && src.startsWith("/") ? withBasePath(src) : src;
  return (
    // next/image は Markdown 画像（幅高さ無し）に不向きなため img を使う
    // biome-ignore lint/performance/noImgElement: static export + MDX markdown images
    <img
      src={resolved}
      alt={alt ?? ""}
      loading="lazy"
      className="rounded-lg border"
      {...props}
    />
  );
}

// 文字列で来た数値属性を number に変換する（未指定は undefined のまま）。
function toNumber(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
    return Number(v);
  }
  return undefined;
}

// MDX 内で <Image ... /> として使える next/image ラッパー。
// 注意点:
// 1) 静的エクスポートでは next/image が basePath を自動付与しないため、ここで補う。
// 2) MDX は数値の式属性（width={1200}）を落とすため、文字列（width="1200"）で
//    受け取り、ここで number へ変換する。
function MdxNextImage({
  src,
  alt,
  className,
  width,
  height,
  ...props
}: ImageProps) {
  const resolvedSrc =
    typeof src === "string" && src.startsWith("/") ? withBasePath(src) : src;
  return (
    <NextImage
      src={resolvedSrc}
      alt={alt}
      width={toNumber(width)}
      height={toNumber(height)}
      className={className ?? "h-auto w-full rounded-lg border"}
      {...props}
    />
  );
}

export const mdxComponents = {
  img: MdxImg,
  Image: MdxNextImage,
  pre: Pre,
};
