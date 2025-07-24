"use client";

interface TabFilterProps {
  tagAndCounts: Record<string, number>;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TabFilter({
  tagAndCounts,
  selectedTag,
  onTagSelect,
}: TabFilterProps) {
  const totalCount = Object.values(tagAndCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <nav className="sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <TagIcon />
        <h3 className="text-lg font-semibold text-[var(--color-text)]">태그</h3>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onTagSelect(null)}
          className={`w-full group flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
            selectedTag === null
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "hover:bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
          }`}
        >
          <span className="font-medium">모든 포스트</span>
          <span
            className={`text-sm font-mono ${
              selectedTag === null
                ? "text-white/90"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            {totalCount}
          </span>
        </button>

        <div className="space-y-1">
          {Object.entries(tagAndCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([tagName, count]) => (
              <button
                key={tagName}
                onClick={() => onTagSelect(tagName)}
                className={`w-full group flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                  selectedTag === tagName
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "hover:bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg ${
                      selectedTag === tagName
                        ? "text-white/80"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    #
                  </span>
                  <span className="font-medium">{tagName}</span>
                </div>
                <span
                  className={`text-sm font-mono ${
                    selectedTag === tagName
                      ? "text-white/90"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <InfoIcon />
          <span>총 {Object.keys(tagAndCounts).length}개의 태그</span>
        </div>
      </div>
    </nav>
  );
}

const TagIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="text-[var(--color-text-secondary)]"
  >
    <path d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);
