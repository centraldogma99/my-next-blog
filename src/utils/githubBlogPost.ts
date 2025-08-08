import type { GetContentsResponse } from "@/types/githubAPI/getContents";
import type { GetContentsDetailData } from "@/types/githubAPI/getContentsDetail";
import { decodeBase64Content } from "@/utils/decodeBase64Content";
import { fetchBlogPostsGithubAPI } from "@/utils/fetchGithubAPI";
import { parseContent, type Frontmatter } from "@/utils/parseFrontmatter";

export interface BlogPost {
  slug: string;
  frontmatter: Frontmatter;
  content?: string;
}

export interface FetchPostsOptions {
  includeDrafts?: boolean;
  includeContent?: boolean;
  sortByDate?: "asc" | "desc";
}

/**
 * 마크다운 파일인지 확인
 */
const isMarkdownFile = (fileName: string): boolean => {
  return fileName.endsWith(".md") || fileName.endsWith(".mdx");
};

/**
 * 블로그 포스트 목록을 가져와서 처리
 */
export async function fetchBlogPosts(
  options: FetchPostsOptions = {},
): Promise<BlogPost[]> {
  const {
    includeDrafts = false,
    includeContent = false,
    sortByDate = "desc",
  } = options;

  // GitHub에서 파일 목록 가져오기
  const postsListData =
    await fetchBlogPostsGithubAPI<GetContentsResponse[]>("/contents/posts");

  // 마크다운 파일만 필터링
  const markdownFiles = postsListData.filter((file) =>
    isMarkdownFile(file.name),
  );

  // 각 파일의 상세 정보 가져오기
  const posts = await Promise.all(
    markdownFiles.map(async (file) => {
      const postData = await fetchSingleBlogPost(file.name, includeContent);
      return postData;
    }),
  );

  // draft 필터링
  const filteredPosts = includeDrafts
    ? posts
    : posts.filter((post) => !post.frontmatter.draft);

  // 날짜순 정렬
  if (sortByDate) {
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return sortByDate === "desc" ? dateB - dateA : dateA - dateB;
    });
  }

  return filteredPosts;
}

/**
 * 단일 블로그 포스트 가져오기
 */
export async function fetchSingleBlogPost(
  fileName: string,
  includeContent = true,
): Promise<BlogPost> {
  const data = await fetchBlogPostsGithubAPI<GetContentsDetailData>(
    `/contents/posts/${fileName}`,
  );

  const decodedContent = decodeBase64Content(data.content);
  const { frontmatter, content } = parseContent(decodedContent);

  // .md 또는 .mdx 확장자 제거
  const fileNameWithoutExtension = data.name.replace(/\.(md|mdx)$/, "");

  return {
    slug: fileNameWithoutExtension,
    frontmatter,
    ...(includeContent && { content }),
  };
}

/**
 * 포스트가 공개되어야 하는지 확인
 */
export function isPostPublished(post: BlogPost): boolean {
  return !post.frontmatter.draft;
}

/**
 * 태그별 포스트 개수 계산
 */
export function getTagCounts(posts: BlogPost[]): Record<string, number> {
  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    post.frontmatter.tag.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return tagCounts;
}

/**
 * 특정 태그를 가진 포스트만 필터링
 */
export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter((post) => post.frontmatter.tag.includes(tag));
}
