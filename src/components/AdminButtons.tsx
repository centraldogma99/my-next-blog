"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { MoreVertical, FileEdit, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { canEditPost } from "@/utils/auth";

interface AdminButtonsProps {
  slug: string;
  isDraft?: boolean;
}

export default function AdminButtons({ slug, isDraft }: AdminButtonsProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 편집 권한 체크
  // TODO: 향후 포스트 작성자 정보를 받아서 canEditPost에 전달
  if (!canEditPost(session)) {
    return null;
  }
    const handleToggleDraft = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}/toggle-draft`, {
          method: "POST",
        });
        
        if (!response.ok) {
          throw new Error("Draft 상태 변경 실패");
        }
        
        // 페이지 새로고침
        window.location.reload();
      } catch (error) {
        console.error("Error toggling draft:", error);
        alert("Draft 상태 변경 중 오류가 발생했습니다.");
      }
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="관리 메뉴"
        >
          <MoreVertical className="w-4 h-4" />
          관리
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <Link
              href={`/admin/posts/${slug}/edit`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FileEdit className="w-4 h-4" />
              <span>포스트 수정</span>
            </Link>
            
            <button
              onClick={() => {
                handleToggleDraft();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{isDraft ? "공개로 변경" : "초안으로 변경"}</span>
            </button>
          </div>
        )}
      </div>
    );
}