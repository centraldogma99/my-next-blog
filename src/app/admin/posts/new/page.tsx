"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Loader2 } from "lucide-react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface PostForm {
  title: string;
  description: string;
  tags: string;
  content: string;
  draft: boolean;
}

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PostForm>({
    title: "",
    description: "",
    tags: "",
    content: "",
    draft: true,
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 날짜 생성
      const date = new Date().toISOString().split("T")[0];
      
      // frontmatter 생성
      const frontmatter = [
        "---",
        `title: "${form.title}"`,
        `date: "${date}"`,
        `tag: [${form.tags.split(",").map(t => `"${t.trim()}"`).join(", ")}]`,
        form.description && `description: "${form.description}"`,
        form.draft && `draft: true`,
        "---",
      ].filter(Boolean).join("\n");

      const fullContent = `${frontmatter}\n\n${form.content}`;

      // 파일명 생성 (제목을 slug로 변환)
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

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
      alert(error instanceof Error ? error.message : "포스트 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [form, router]);

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
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            설명
          </label>
          <input
            id="description"
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="포스트 설명 (SEO용)"
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
          <label className="block text-sm font-medium mb-2">
            내용 *
          </label>
          <div data-color-mode="light" className="min-h-[500px]">
            <MDEditor
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value || "" })}
              preview="live"
              height={500}
            />
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