"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { generateFrontmatter } from "@/utils/frontmatter";
import { useTheme } from "@/contexts/ThemeContext";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

interface PostForm {
  title: string;
  subtitle: string;
  tags: string;
  content: string;
  draft: boolean;
}

export default function NewPostPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PostForm>({
    title: "",
    subtitle: "",
    tags: "",
    content: "",
    draft: true,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        // FormData 생성
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('tags', form.tags);
        formData.append('description', form.subtitle || '');
        formData.append('draft', String(form.draft));
        
        // 파일명 생성 (제목을 slug로 변환)
        const slug = form.title
          .toLowerCase()
          .replace(/[^a-z0-9가-힣]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        formData.append('slug', slug);
        
        // frontmatter 생성
        const frontmatter = generateFrontmatter(formData);
        const fullContent = `${frontmatter}${form.content}`;

        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            content: fullContent,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "포스트 생성 실패");
        }

        router.push(`/posts/${slug}`);
      } catch (error) {
        console.error("Error creating post:", error);
        alert(
          error instanceof Error
            ? error.message
            : "포스트 생성 중 오류가 발생했습니다.",
        );
      } finally {
        setLoading(false);
      }
    },
    [form, router],
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">새 포스트 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            제목 *
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="포스트 제목을 입력하세요"
          />
        </div>

        <div>
          <label
            htmlFor="subtitle"
            className="block text-sm font-medium mb-2"
          >
            부제목
          </label>
          <input
            id="subtitle"
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="포스트 부제목"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            태그 (콤마로 구분)
          </label>
          <input
            id="tags"
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: React, TypeScript, Next.js"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="draft"
            type="checkbox"
            checked={form.draft}
            onChange={(e) => setForm({ ...form, draft: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="draft" className="text-sm font-medium">
            초안으로 저장 (공개하지 않음)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">내용 *</label>
          <div data-color-mode={theme} className="min-h-[500px]">
            <div className="wmde-markdown-var">
              <MDEditor
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value || "" })}
                preview="live"
                height={500}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !form.title || !form.content}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "저장 중..." : "포스트 저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
