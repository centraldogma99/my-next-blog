import PostsContainer from "@/app/PostsContainer";
import { fetchBlogPosts, getTagCounts } from "@/utils/api/github";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 20000;

export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; showDrafts?: string }>;
}) {
  const { tag, showDrafts } = await searchParams;

  // 세션 정보 가져오기
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin || false;

  // 개발 환경이거나 운영 환경에서 관리자인 경우 draft 토글 가능
  const canViewDrafts = process.env.NODE_ENV === "development" || isAdmin;
  const includeDrafts = canViewDrafts && showDrafts === "true";

  // draft 포스트 포함 여부 결정
  const posts = await fetchBlogPosts({
    includeDrafts,
  });
  const tagAndCounts = getTagCounts(posts);

  return (
    <PostsContainer
      posts={posts}
      tags={tagAndCounts}
      initialTag={tag || null}
      showDraftToggle={canViewDrafts}
      initialShowDrafts={includeDrafts}
    />
  );
}
