import PostsList from "@/app/PostsList";
import { fetchBlogPosts, getTagCounts } from "@/utils/githubBlogPost";

export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  // draft를 제외한 포스트만 가져오기 (이미 유틸에서 처리)
  const posts = await fetchBlogPosts({ includeDrafts: false });
  const tagAndCounts = getTagCounts(posts);

  return (
    <PostsList posts={posts} tags={tagAndCounts} initialTag={tag || null} />
  );
}
