import PostsList from "@/app/PostsList";
import { fetchBlogPosts, getTagCounts } from "@/utils/githubBlogPost";

export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; showDrafts?: string }>;
}) {
  const { tag, showDrafts } = await searchParams;
  
  // 개발 환경에서만 draft 토글 가능
  const isDevelopment = process.env.NODE_ENV === "development";
  const includeDrafts = isDevelopment && showDrafts === "true";
  
  // draft 포함 여부에 따라 포스트 가져오기
  const posts = await fetchBlogPosts({ includeDrafts });
  const tagAndCounts = getTagCounts(posts);

  return (
    <PostsList 
      posts={posts} 
      tags={tagAndCounts} 
      initialTag={tag || null}
      showDraftToggle={isDevelopment}
      initialShowDrafts={includeDrafts}
    />
  );
}
