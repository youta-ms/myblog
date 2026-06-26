import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// ビルド時に robots.txt を生成する（sitemap への参照を含む）。
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
