import { HashScrollHandler } from "@/app/posts/[slug]/(components)/HashScrollHandler";
import { extractHeadingsFromContents } from "@/utils/contentProcessing";
import { fetchSingleBlogPost } from "@/utils/api/github";
import { AUTHOR_NAME } from "@/constants/site";
import MarkdownContent from "@/components/MarkdownContent";
import type { Metadata } from "next";
import { TableOfContents } from "@/app/posts/[slug]/(components)/TableOfContents";
import { notFound } from "next/navigation";
import AdminButtons from "@/components/AdminButtons";
import Script from "next/script";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await fetchSingleBlogPost(`${slug}.md`, false);
    const { frontmatter } = post;

    return {
      title: `[DRAFT] ${frontmatter.title}`,
      description:
        frontmatter.description || `${frontmatter.title}에 대한 글입니다.`,
      robots: "noindex, nofollow", // Draft 포스트는 검색 엔진에서 제외
    };
  } catch {
    return {
      title: "포스트를 찾을 수 없습니다",
      description: "요청하신 포스트가 존재하지 않거나 삭제되었을 수 있습니다.",
    };
  }
}

// Draft 페이지는 항상 동적으로 렌더링
export const dynamic = "force-dynamic";

export default async function DraftPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 세션 체크 - 관리자만 접근 가능
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin || false;
  const canViewDrafts = process.env.NODE_ENV === "development" || isAdmin;

  if (!canViewDrafts) {
    notFound();
  }

  const { slug } = await params;

  let post;
  try {
    post = await fetchSingleBlogPost(`${slug}.md`, true);
  } catch {
    notFound();
  }

  const { content, frontmatter } = post;

  // Draft가 아닌 포스트는 일반 포스트 페이지로 리다이렉트
  if (!frontmatter.draft) {
    return (
      <Script id="redirect-to-post">
        {`window.location.href = '/posts/${slug}';`}
      </Script>
    );
  }

  if (!content) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description:
      frontmatter.description || `${frontmatter.title}에 대한 글입니다.`,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    keywords: frontmatter.tag.join(", "),
  };

  // 모든 heading을 미리 추출하여 고유 ID 생성
  const headingsWithIds = extractHeadingsFromContents(content);

  return (
    <>
      <HashScrollHandler />
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-full">
        <div className="lg:flex lg:gap-2 relative max-w-full">
          <TableOfContents
            headings={headingsWithIds}
            className="py-4 w-[280px] hidden lg:block lg:sticky lg:top-20 lg:overflow-y-auto lg:self-start flex-shrink-0"
          />
          <div className="flex-1 py-6 pt-12 pb-24 px-6 min-w-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="break-keep flex-1">
                  {frontmatter.title}
                  <span className="ml-3 px-3 py-1 text-base bg-yellow-500 text-white rounded">
                    DRAFT
                  </span>
                </h1>
                <AdminButtons slug={slug} isDraft={frontmatter.draft} sha={post.sha} />
              </div>
              <MarkdownContent 
                content={content} 
                headingsWithIds={headingsWithIds} 
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}