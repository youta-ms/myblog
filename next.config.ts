import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// GitHub Pages 用の basePath。
// 例: https://<user>.github.io/myblog なら "/myblog"。
// GitHub Actions が NEXT_PUBLIC_BASE_PATH を自動設定します（deploy.yml 参照）。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // 静的 HTML を out/ に書き出す（GitHub Pages 用）
  output: "export",
  basePath,
  // GitHub Pages はサーバーが無いため画像最適化を無効化
  images: { unoptimized: true },
  // /posts/foo/ → /posts/foo/index.html を生成
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX();
export default withMDX(nextConfig);
