"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface TabFilterProps {
  tags: string[];
  tagCounts: Record<string, number>;
  initialTag: string | null;
}

const TAB_CHUNK_SIZE = 8;

export default function TabFilter({
  tags,
  tagCounts,
  initialTag,
}: TabFilterProps) {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag") || initialTag;

  // "전체" 탭을 포함한 모든 탭 목록
  const totalCount = Object.values(tagCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  // 8개씩 청크로 나누기
  const tabChunks: string[][] = [];
  for (let i = 0; i < tags.length; i += TAB_CHUNK_SIZE) {
    tabChunks.push(tags.slice(i, i + TAB_CHUNK_SIZE));
  }

  return (
    <>
      {tabChunks.map((chunk, lineIndex) => (
        <menu
          key={lineIndex}
          role="tablist"
          className={tabChunks.length > 1 ? "multirows" : ""}
        >
          {lineIndex === 0 && (
            <li role="tab" key="전체" aria-selected={currentTag === null}>
              <Link href={"/"}>전체</Link>
            </li>
          )}
          {chunk.map((tab) => {
            const count = tab === "전체" ? totalCount : tagCounts[tab];
            const isSelected =
              tab === "전체" ? currentTag === null : currentTag === tab;

            return (
              <li role="tab" key={tab} aria-selected={isSelected}>
                <Link
                  href={
                    tab === "전체" ? "/" : `/?tag=${encodeURIComponent(tab)}`
                  }
                >
                  {tab} ({count})
                </Link>
              </li>
            );
          })}
        </menu>
      ))}
    </>
  );
}
