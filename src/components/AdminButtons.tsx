"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Edit, Plus } from "lucide-react";

interface AdminButtonsProps {
  type: "new" | "edit";
  slug?: string;
}

export default function AdminButtons({ type, slug }: AdminButtonsProps) {
  const { data: session } = useSession();

  // 인증된 사용자가 아니면 버튼을 표시하지 않음
  if (!session) {
    return null;
  }

  if (type === "new") {
    return (
      <Link
        href="/admin/posts/new"
        className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="새 포스트 작성"
      >
        <Plus className="w-6 h-6" />
      </Link>
    );
  }

  if (type === "edit" && slug) {
    return (
      <Link
        href={`/admin/posts/${slug}/edit`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Edit className="w-4 h-4" />
        포스트 수정
      </Link>
    );
  }

  return null;
}