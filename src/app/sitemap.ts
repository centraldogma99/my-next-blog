import { MetadataRoute } from "next";
import { fetchBlogPosts } from "@/utils/api/github";
import { DOMAIN } from "@/constants/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = DOMAIN;

  // 블로그 포스트 목록 가져오기 (draft 제외)
  const posts = await fetchBlogPosts({ includeDrafts: false });

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.frontmatter.date,
    priority: 1,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
      priority: 1,
    },
    ...postUrls,
  ];
}
