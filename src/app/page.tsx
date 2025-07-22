import type { GetContentsResponse } from "@/types/githubAPI/getContents";
import type { GetContentsDetailResponse } from "@/types/githubAPI/getContentsDetail";
import { decodeBase64Content } from "@/utils/decodeBase64Content";
import { extractTitleFromMarkdown } from "@/utils/extractTitleFromMarkdown";
import { fetchBlogPostsGithubAPI } from "@/utils/fetchGithubAPI";
import Link from "next/link";

const fetchPosts = async (): Promise<{ title: string; fileName: string }[]> => {
  const postsListData =
    await fetchBlogPostsGithubAPI<GetContentsResponse[]>("/contents");

  // .prettierignore 과 같은 불필요한 파일 거르기
  const filteredPostsListData = postsListData.filter(
    (githubFile: GetContentsResponse) =>
      githubFile.name.endsWith(".md") || githubFile.name.endsWith(".mdx"),
  );
  return await Promise.all(
    filteredPostsListData.map(async (post) => {
      const data = await fetchBlogPostsGithubAPI<GetContentsDetailResponse>(
        `/contents/${post.name}`,
      );
      return {
        title: extractTitleFromMarkdown(decodeBase64Content(data.content)),
        fileName: data.name,
      };
    }),
  );
};

export default async function Posts() {
  const data = await fetchPosts();

  return (
    <div>
      <h1>Dogma Blog Posts</h1>
      <ul>
        {data.map((post) => (
          <li key={post.fileName}>
            <Link href={`/posts/${post.fileName}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
