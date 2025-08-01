import { MetadataRoute } from "next";
import type { GetContentsResponse } from "@/types/githubAPI/getContents";
import { fetchBlogPostsGithubAPI } from "@/utils/fetchGithubAPI";
import { DOMAIN } from "@/constants/domain";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = DOMAIN;

  // 블로그 포스트 목록 가져오기
  const postsListData =
    await fetchBlogPostsGithubAPI<GetContentsResponse[]>("/contents");

  const posts = postsListData
    .filter(
      (githubFile: GetContentsResponse) =>
        githubFile.name.endsWith(".md") || githubFile.name.endsWith(".mdx")
    )
    .map((post) => ({
      url: `${baseUrl}/posts/${post.name}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts,
  ];
}