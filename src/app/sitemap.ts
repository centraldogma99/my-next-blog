import { MetadataRoute } from "next";
import { fetchBlogPosts } from "@/utils/api/github";
import { DOMAIN } from "@/constants/domain";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = DOMAIN;

  // 블로그 포스트 목록 가져오기 (draft 제외)
  const posts = await fetchBlogPosts({ includeDrafts: false });

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    ...postUrls,
  ];
}
