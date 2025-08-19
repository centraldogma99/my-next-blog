import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { Octokit } from "octokit";
import type { GetContentsResponse } from "@/types/githubAPI/getContents";
import type { GetContentsDetailData } from "@/types/githubAPI/getContentsDetail";
import { decodeBase64String } from "@/utils/decodeBase64String";
import { parseContent, type Frontmatter } from "@/utils/frontmatter";

export interface GitHubConfig {
  owner: string;
  repo: string;
}

export function validateGitHubConfig(): GitHubConfig | NextResponse {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!owner || !repo) {
    return NextResponse.json(
      { message: "GitHub 리포지토리 설정이 필요합니다." },
      { status: 500 },
    );
  }

  return { owner, repo };
}

export interface CommitterInfo {
  name: string;
  email: string;
}

export function getCommitterInfo(user?: {
  name?: string | null;
  email?: string | null;
}): CommitterInfo {
  return {
    name: user?.name || "Anonymous",
    email: user?.email || "anonymous@example.com",
  };
}

export async function getFileSHA(
  octokit: Octokit,
  config: GitHubConfig,
  path: string,
): Promise<string | null> {
  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path,
    });

    if ("sha" in fileData) {
      return fileData.sha;
    }
    return null;
  } catch (error) {
    console.error("Error getting file SHA:", error);
    return null;
  }
}

export const fetchBlogPostsGithubAPI = async <T>(url: string) => {
  const response = await fetch(
    `https://api.github.com/repos/centraldogma99/dogma-blog-posts${url}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );
  const data = await response.json();
  if ("message" in data) {
    if (data.message.includes("Not Found")) {
      notFound();
    } else {
      throw new Error(data.message);
    }
  }
  return data as T;
};

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

  const decodedContent = decodeBase64String(data.content);
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
