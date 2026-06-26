import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

// 静的エクスポート時にビルド時 sitemap.xml を生成する。
// trailingSlash: true 構成に合わせて末尾スラッシュ付きで出力。
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: posts[0]?.date ? new Date(posts[0].date) : new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/tags/"),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}/`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tagPages: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: absoluteUrl(`/tags/${encodeURIComponent(tag)}/`),
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticPages, ...postPages, ...tagPages];
}
