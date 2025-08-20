"use client";

import { useState, useTransition } from "react";
import PostsList from "./PostsList";
import DraftToggle from "./DraftToggle";
import type { BlogPost } from "@/utils/api/github";
import { useRouter } from "next/navigation";

interface PostsContainerProps {
  posts: BlogPost[];
  tags: Record<string, number>;
  initialTag: string | null;
  showDraftToggle?: boolean;
  initialShowDrafts?: boolean;
}

export default function PostsContainer({
  posts,
  tags,
  initialTag,
  showDraftToggle = false,
  initialShowDrafts = false,
}: PostsContainerProps) {
  const [showDrafts, setShowDrafts] = useState(initialShowDrafts);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Draft 토글에 따라 포스트 필터링
  const visiblePosts = showDrafts 
    ? posts 
    : posts.filter(post => !post.frontmatter.draft);

  const handleDraftToggle = () => {
    startTransition(() => {
      setShowDrafts(!showDrafts);
      router.refresh();
    });
  };

  return (
    <>
      {/* 로딩 오버레이 */}
      {isPending && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-6 shadow-xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[var(--color-text-secondary)] border-t-[var(--color-primary)]"></div>
              <span className="text-[var(--color-text)] text-sm font-medium">
                {showDrafts ? "Draft 포스트 숨기는 중..." : "Draft 포스트 불러오는 중..."}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className={isPending ? "opacity-50 pointer-events-none transition-opacity duration-200" : "transition-opacity duration-200"}>
        <PostsList 
          posts={visiblePosts} 
          tags={tags} 
          initialTag={initialTag}
        />
      </div>
      
      {showDraftToggle && (
        <DraftToggle 
          showDrafts={showDrafts} 
          onToggle={handleDraftToggle}
        />
      )}
    </>
  );
}