"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface DraftToggleProps {
  showDrafts: boolean;
  onToggle: () => void;
}

export default function DraftToggle({
  showDrafts,
  onToggle,
}: DraftToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    onToggle();

    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (!showDrafts) {
      params.set("showDrafts", "true");
    } else {
      params.delete("showDrafts");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 확장된 상태 */}
      {isExpanded && (
        <div className="mb-3 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--color-text)] whitespace-nowrap">
              Draft 포스트 표시
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showDrafts}
              onClick={handleToggle}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors focus:outline-none focus:ring-2 
                focus:ring-[var(--color-primary)] focus:ring-offset-2
                ${
                  showDrafts
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-text-secondary)]"
                }
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full 
                  bg-white transition-transform
                  ${showDrafts ? "translate-x-6" : "translate-x-1"}
                `}
              />
            </button>
          </div>
          {showDrafts && (
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              ⚠️ Draft 포스트 표시 중
            </p>
          )}
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          group relative flex items-center justify-center
          w-14 h-14 rounded-full shadow-lg
          transition-all duration-200 hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
          ${
            showDrafts
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-[var(--color-text-secondary)] hover:bg-[var(--color-text)]"
          }
        `}
        aria-label={
          isExpanded ? "토글 메뉴 닫기" : "Draft 설정 열기"
        }
      >
        {isExpanded ? (
          // X 아이콘
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // 문서 아이콘
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M14,4L18,8H14V4M8,13H16V15H8V13M8,17H16V19H8V17Z" />
            {showDrafts && (
              <circle
                cx="18"
                cy="18"
                r="3"
                fill="orange"
                stroke="white"
                strokeWidth="1"
              />
            )}
          </svg>
        )}

        {/* Draft 활성화 표시 */}
        {showDrafts && !isExpanded && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"
          />
        )}
      </button>
    </div>
  );
}
