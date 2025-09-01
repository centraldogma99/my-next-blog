/* eslint-disable react/display-name */
import { HashScrollHandler } from "@/app/posts/[slug]/(components)/HashScrollHandler";
import { extractHeadingsFromContents } from "@/utils/contentProcessing";
import { fetchSingleBlogPost } from "@/utils/api/github";
import { AUTHOR_NAME } from "@/constants/site";
import type { Metadata } from "next";
import { TableOfContents } from "@/app/posts/[slug]/(components)/TableOfContents";
import { notFound } from "next/navigation";
import AdminButtons from "@/components/AdminButtons";
import Script from "next/script";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import React, { type ReactNode } from "react";
import Markdown from "react-markdown";
import {
  CodeBlock,
  isSupportedLanguage,
} from "@/app/posts/[slug]/(components)/CodeBlock";
import { HeadingWithAnchor } from "@/app/posts/[slug]/(components)/HeadingWithAnchor";

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

  // heading 인덱스를 추적하기 위한 클로저 생성
  let headingIndex = 0;
  const createHeadingComponent = (
    level: 1 | 2 | 3 | 4 | 5 | 6,
    className?: string,
  ) => {
    return ({ children }: { children?: ReactNode }) => {
      const currentHeading = headingsWithIds[headingIndex];
      headingIndex++;
      return (
        <HeadingWithAnchor level={level} id={currentHeading?.id} className={className}>
          {children}
        </HeadingWithAnchor>
      );
    };
  };

  const getChildrenCodeTag = (node: ReactNode) => {
    if (!node || React.Children.count(node) !== 1) return false;
    const child = React.Children.toArray(node)[0];
    return React.isValidElement(child) && child.type === "code" ? child : false;
  };

  const isValidCodeElement = (
    codeElement: React.ReactElement,
  ): codeElement is React.ReactElement<{
    className: string;
    children: React.ReactNode;
  }> => {
    return !!(
      codeElement.props &&
      typeof codeElement.props === "object" &&
      "className" in codeElement.props &&
      typeof codeElement.props.className === "string" &&
      "children" in codeElement.props
    );
  };

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
              <Markdown
                components={{
                  h1: createHeadingComponent(1, "text-4xl font-bold mt-8 mb-6"),
                  h2: createHeadingComponent(
                    2,
                    "text-3xl font-semibold mt-12 mb-4",
                  ),
                  h3: createHeadingComponent(3, "text-2xl font-medium mt-8 mb-3"),
                  h4: createHeadingComponent(4, "text-xl font-medium mt-6 mb-2"),
                  h5: createHeadingComponent(5, "text-lg font-medium mt-4 mb-2"),
                  h6: createHeadingComponent(6, "text-base font-medium mt-3 mb-1"),
                  p: ({ children }) => <p className="my-3">{children}</p>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:underline"
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 my-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 my-4">{children}</ol>
                  ),
                  li: ({ children }) => <li className="my-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">
                      {children}
                    </blockquote>
                  ),
                  pre: (props) => {
                    const codeElement = getChildrenCodeTag(props.children);
                    if (!codeElement || !isValidCodeElement(codeElement))
                      return <pre>{props.children}</pre>;

                    // 타입 가드를 통과했으므로 안전하게 접근 가능
                    const codeProps = codeElement.props as {
                      className: string;
                      children: React.ReactNode;
                    };
                    const language = codeProps.className.replace("language-", "");

                    if (language && isSupportedLanguage(language))
                      return (
                        <CodeBlock language={language}>
                          {String(codeProps.children)}
                        </CodeBlock>
                      );
                    else return <pre>{props.children}</pre>;
                  },
                }}
              >
                {content}
              </Markdown>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}