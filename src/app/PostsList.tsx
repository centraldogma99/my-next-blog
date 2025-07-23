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
        <h3>{selectedTag ? `${selectedTag} 포스트` : "포스트"}</h3>
        {filteredPosts.map((post) => (
          <div key={post.fileName}>
            <Link href={`/posts/${post.fileName}`}>{post.title}</Link>
          </div>
        ))}
      </main>
    </div>
  );
}
