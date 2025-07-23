"use client";

import type { Frontmatter } from "@/utils/parseFrontmatter";
import Link from "next/link";
import { useState } from "react";
import TabFilter from "./TabFilter";
import { pretendard } from "@/app/fonts";

interface Post {
  title: string;
  frontmatter: Frontmatter;
  fileName: string;
}

interface TabViewProps {
  posts: Post[];
  tags: Record<string, number>;
  initialTag: string | null;
}

export default function PostsList({ posts, tags, initialTag }: TabViewProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.frontmatter.tag.includes(selectedTag))
    : posts;

  return (
    <div className="grid grid-cols-[1fr_3fr]">
      <aside className="p-4">
        <TabFilter
          tagAndCounts={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
      </aside>
      <main className={pretendard.className}>
        <div className="window m-4">
          <div className="title-bar">
            <div className="title-bar-text">
              {selectedTag ? `${selectedTag} 포스트` : "모든 포스트"}
            </div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>
          <div className="window-body">
            <div className="sunken-panel">
              {filteredPosts.map((post) => (
                <div key={post.fileName} className="field-row-stacked mb-4 p-4 hover:bg-[#0080FF] hover:text-white transition-colors">
                  <Link href={`/posts/${post.fileName}`} className="block">
                    <h4 className="text-lg font-bold mb-2">{post.title}</h4>
                    <div className="flex gap-2 text-sm">
                      {post.frontmatter.date && (
                        <span className="status-bar-field">📅 {post.frontmatter.date}</span>
                      )}
                      {post.frontmatter.tag && post.frontmatter.tag.length > 0 && (
                        <span className="status-bar-field">
                          🏷️ {post.frontmatter.tag.join(", ")}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
