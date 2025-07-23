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

// 서버에서 태그 계산
function extractUniqueTags(posts: Post[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.frontmatter.tag.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
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

const fetchPosts = async (): Promise<Post[]> => {
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
  const posts = await fetchPosts();
  const tags = extractUniqueTags(posts);
  const tagCounts = getTagCounts(posts);

  // 서버에서 필터링 수행
  const selectedTag = tag || null;
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.frontmatter.tag.includes(selectedTag))
    : posts;

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Dogma Blog Posts</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" />
        </div>
      </div>

      <PostsList
        posts={filteredPosts}
        tags={tags}
        tagCounts={tagCounts}
        initialTag={selectedTag}
      />
    </div>
  );
}
