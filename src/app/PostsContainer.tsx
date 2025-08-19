"use client";

import { useState } from "react";
import PostsList from "./PostsList";
import DraftToggle from "./DraftToggle";
import type { BlogPost } from "@/utils/api/github";

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

  // Draft 토글에 따라 포스트 필터링
  const visiblePosts = showDrafts 
    ? posts 
    : posts.filter(post => !post.frontmatter.draft);

  return (
    <>
      <PostsList 
        posts={visiblePosts} 
        tags={tags} 
        initialTag={initialTag}
      />
      {showDraftToggle && (
        <DraftToggle 
          showDrafts={showDrafts} 
          onToggle={() => setShowDrafts(!showDrafts)} 
        />
      )}
    </>
  );
}