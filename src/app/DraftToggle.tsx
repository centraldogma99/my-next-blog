"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface DraftToggleProps {
  showDrafts: boolean;
  onToggle: () => void;
}

export default function DraftToggle({ showDrafts, onToggle }: DraftToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleToggle = () => {
    onToggle();
    
    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (!showDrafts) {
      params.set('showDrafts', 'true');
    } else {
      params.delete('showDrafts');
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-6 p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)]">
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium text-[var(--color-text)]">
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
            ${showDrafts 
              ? 'bg-[var(--color-primary)]' 
              : 'bg-[var(--color-text-secondary)]'
            }
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full 
              bg-white transition-transform
              ${showDrafts ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </label>
      {showDrafts && (
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          ⚠️ 개발 환경 전용 기능입니다
        </p>
      )}
    </div>
  );
}