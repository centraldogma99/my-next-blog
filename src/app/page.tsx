import PostsList from "@/app/PostsList";
import type { GetContentsResponse } from "@/types/githubAPI/getContents";
import type { GetContentsDetailResponse } from "@/types/githubAPI/getContentsDetail";
import { decodeBase64Content } from "@/utils/decodeBase64Content";
import { extractTitleFromMarkdown } from "@/utils/extractTitleFromMarkdown";
import { fetchBlogPostsGithubAPI } from "@/utils/fetchGithubAPI";
import { parseFrontmatter, type Frontmatter } from "@/utils/parseFrontmatter";

interface Post {
  title: string;
  fileName: string;
  frontmatter: Frontmatter;
}

// 태그별 포스트 개수 계산
function getTagCounts(posts: Post[]): Record<string, number> {
  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    post.frontmatter.tag.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return tagCounts;
}

const fetchAndParsePosts = async (): Promise<Post[]> => {
  const postsListData =
    await fetchBlogPostsGithubAPI<GetContentsResponse[]>("/contents");

  const filteredPostsListData = postsListData.filter(
    (githubFile: GetContentsResponse) =>
      githubFile.name.endsWith(".md") || githubFile.name.endsWith(".mdx"),
  );

  return Promise.all(
    filteredPostsListData.map(async (post) => {
      const data = await fetchBlogPostsGithubAPI<GetContentsDetailResponse>(
        `/contents/${post.name}`,
      );
      const decodedContent = decodeBase64Content(data.content);
      const { frontmatter } = parseFrontmatter(decodedContent);
      return {
        title: extractTitleFromMarkdown(decodedContent),
        frontmatter,
        fileName: data.name,
      };
    }),
  );
};

export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const posts = await fetchAndParsePosts();
  const tagAndCounts = getTagCounts(posts);

  return (
    <PostsList posts={posts} tags={tagAndCounts} initialTag={tag || null} />
  );
}
