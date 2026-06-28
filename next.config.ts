import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Netlify（Next.js ランタイム）にデプロイする構成。
// - 静的エクスポート(output:"export")は使わず、SSG/SSR/ISR と
//   next/image の自動最適化（Netlify Image CDN による WebP/AVIF 変換）を利用する。
// - ルート配信のため basePath は不要。
const nextConfig: NextConfig = {
  // 末尾スラッシュで URL を正規化（sitemap / canonical と揃える）
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX();
export default withMDX(nextConfig);
