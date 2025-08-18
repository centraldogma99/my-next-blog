import PostsContainer from "@/app/PostsContainer";
import { fetchBlogPosts, getTagCounts } from "@/utils/githubBlogPost";
import AdminButtons from "@/components/AdminButtons";

export const revalidate = 120; // 120초(2분)마다 ISR 리밸리데이션

export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; showDrafts?: string }>;
}) {
  const { tag, showDrafts } = await searchParams;
  
  // 개발 환경에서만 draft 토글 가능
  const isDevelopment = process.env.NODE_ENV === "development";
  const includeDrafts = isDevelopment && showDrafts === "true";
  
  // 개발 환경에서는 모든 포스트를 가져오고, 클라이언트에서 필터링
  // 프로덕션에서는 draft 제외한 포스트만 가져옴
  const posts = await fetchBlogPosts({ 
    includeDrafts: isDevelopment // 개발 환경에서는 모든 포스트 가져오기
  });
  const tagAndCounts = getTagCounts(posts);

  return (
    <>
      <PostsContainer 
        posts={posts} 
        tags={tagAndCounts} 
        initialTag={tag || null}
        showDraftToggle={isDevelopment}
        initialShowDrafts={includeDrafts}
      />
      <AdminButtons type="new" />
    </>
  );
}
