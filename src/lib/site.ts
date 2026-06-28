// サイト全体の設定。SEO メタデータ・sitemap・robots で共通利用する。
//
// origin: 公開オリジン。優先順位は
//   1) NEXT_PUBLIC_SITE_ORIGIN（独自ドメイン等を明示したい場合に設定）
//   2) URL（Netlify がビルド時に本番URLを自動注入する）
//   3) ローカル開発用のフォールバック
// Netlify はルート配信のため basePath は不要（空文字）。
const origin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ??
  process.env.URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

export const siteConfig = {
  name: "ひなたの技術メモ",
  description: "Web開発・インフラ・日々の学びを書く技術ブログ",
  origin,
  // 公開URLの基点
  url: origin,
} as const;

// サイト内パスを絶対URLに変換する。`path` は先頭スラッシュ付きで渡す。
export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
