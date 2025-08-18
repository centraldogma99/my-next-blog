"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

interface PostForm {
  title: string;
  description: string;
  tags: string;
  content: string;
  draft: boolean;
  date: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PostForm>({
    title: "",
    description: "",
    tags: "",
    content: "",
    draft: false,
    date: "",
  });

  // 기존 포스트 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (!response.ok) {
          throw new Error("포스트를 불러올 수 없습니다.");
        }

        const data = await response.json();
        const { frontmatter, content } = data;

        setForm({
          title: frontmatter.title || "",
          description: frontmatter.description || "",
          tags: frontmatter.tag?.join(", ") || "",
          content: content || "",
          draft: frontmatter.draft || false,
          date: frontmatter.date || "",
        });
      } catch (error) {
        console.error("Error loading post:", error);
        alert("포스트를 불러오는데 실패했습니다.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
        // 태그 처리
        const tags = form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        
        // frontmatter 생성
        const frontmatterParts = [
          "---",
          `title: "${form.title}"`,
          `date: "${form.date}"`,
        ];
        
        // 태그를 YAML 리스트 형식으로 추가
        if (tags.length > 0) {
          frontmatterParts.push("tag:");
          tags.forEach(tag => {
            frontmatterParts.push(`  - ${tag}`);
          });
        }
        
        if (form.description) {
          frontmatterParts.push(`description: "${form.description}"`);
        }
        
        if (form.draft) {
          frontmatterParts.push(`draft: true`);
        }
        
        frontmatterParts.push("---");
        
        const frontmatter = frontmatterParts.join("\n");

        const fullContent = `${frontmatter}\n\n${form.content}`;

        const response = await fetch(`/api/posts/${slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: fullContent,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "포스트 수정 실패");
        }

        router.push(`/posts/${slug}`);
      } catch (error) {
        console.error("Error updating post:", error);
        alert(
          error instanceof Error
            ? error.message
            : "포스트 수정 중 오류가 발생했습니다.",
        );
      } finally {
        setSaving(false);
      }
    },
    [form, slug, router],
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">포스트 수정</h1>

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
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            날짜
          </label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
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
          <label className="block text-sm font-medium mb-2">내용 *</label>
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
            disabled={saving || !form.title || !form.content}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "저장 중..." : "변경사항 저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/posts/${slug}`)}
            className="px-6 py-2 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
