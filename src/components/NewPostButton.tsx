"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { canCreatePost } from "@/utils/auth";

export default function NewPostButton() {
  const { data: session } = useSession();

  // 글 작성 권한이 있는 사용자에게만 표시
  if (!canCreatePost(session)) {
    return null;
  }

  return (
    <Link
      href="/admin/posts/new"
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      title="새 포스트 작성"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">새 글</span>
    </Link>
  );
}
