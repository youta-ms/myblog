// サイト全体の設定。SEO メタデータ・sitemap・robots で共通利用する。
//
// origin: 公開オリジン。独自ドメインなら NEXT_PUBLIC_SITE_ORIGIN で上書き。
//   既定は GitHub Pages のプロジェクトページ (https://youta-ms.github.io)。
// basePath: サブパス配信時の接頭辞。GitHub Actions が NEXT_PUBLIC_BASE_PATH を
//   設定する（next.config.ts と同じ値）。ルート配信なら空文字。
const origin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://youta-ms.github.io"
).replace(/\/$/, "");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const siteConfig = {
  name: "ひなたの技術メモ",
  description: "Web開発・インフラ・日々の学びを書く技術ブログ",
  origin,
  basePath,
  // 公開URLの基点（例: https://youta-ms.github.io/myblog）
  url: `${origin}${basePath}`,
} as const;

// サイト内パスを絶対URLに変換する。`path` は先頭スラッシュ付きで渡す。
export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
