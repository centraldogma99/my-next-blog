"use client";

import Link from "next/link";
import { useState } from "react";
import TabFilter from "./TabFilter";
import { pretendard } from "@/app/fonts";
import type { BlogPost } from "@/utils/api/github";

interface TabViewProps {
  posts: BlogPost[];
  tags: Record<string, number>;
  initialTag: string | null;
}

export default function PostsList({ posts, tags, initialTag }: TabViewProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.frontmatter.tag.includes(selectedTag))
    : posts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 pt-12 pb-24 px-6">
      <aside className="lg:sticky lg:top-6 lg:h-fit">
        <TabFilter
          tagAndCounts={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          totalPosts={posts.length}
        />
      </aside>
      <div className={pretendard.className}>
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">
          {selectedTag ? `${selectedTag} 포스트` : "모든 포스트"}
        </h2>
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors bg-[var(--color-bg)]"
            >
              <Link href={`/posts/${post.slug}`} className="block">
                <h3 className="text-lg font-semibold mb-2 text-[var(--color-text)] hover:text-[var(--color-primary)]">
                  {post.frontmatter.title}
                  {post.frontmatter.draft && (
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-500 text-white rounded">
                      DRAFT
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
                  {post.frontmatter.date && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon />
                      <span>{post.frontmatter.date}</span>
                    </div>
                  )}
                  {post.frontmatter.tag && post.frontmatter.tag.length > 0 && (
                    <div className="flex items-center gap-1">
                      <TagIcon />
                      <span>{post.frontmatter.tag.join(", ")}</span>
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h8.5a.25.25 0 01.25.25V6h-11V3.75a.25.25 0 01.25-.25h2zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z" />
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z" />
  </svg>
);
