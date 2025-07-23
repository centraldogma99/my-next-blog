import type { Frontmatter } from "@/utils/parseFrontmatter";
import Link from "next/link";
import TabFilter from "./TabFilter";

interface Post {
  title: string;
  frontmatter: Frontmatter;
  fileName: string;
}

interface TabViewProps {
  posts: Post[];
  tags: string[];
  tagCounts: Record<string, number>;
  initialTag: string | null;
}

export default function PostsList({ posts, tags, tagCounts, initialTag }: TabViewProps) {
  return (
    <>
      <TabFilter tags={tags} tagCounts={tagCounts} initialTag={initialTag} />
      <div className="window-body">
        {posts.map((post) => (
          <div key={post.fileName}>
            <Link href={`/posts/${post.fileName}`}>{post.title}</Link>
          </div>
        ))}
      </div>
    </>
  );
}
