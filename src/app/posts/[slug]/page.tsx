/* eslint-disable react/display-name */
import {
  CodeBlock,
  isSupportedLanguage,
} from "@/app/posts/[slug]/(components)/CodeBlock";
import { HashScrollHandler } from "@/app/posts/[slug]/(components)/HashScrollHandler";
import { HeadingWithAnchor } from "@/app/posts/[slug]/(components)/HeadingWithAnchor";
import { extractHeadingsWithIds } from "@/utils/generateUniqueSlug";
import { fetchSingleBlogPost, isPostPublished } from "@/utils/githubBlogPost";
import { AUTHOR_NAME } from "@/constants/site";
import type { ReactNode } from "react";
import React from "react";
import Markdown from "react-markdown";
import type { Metadata } from "next";
import { TableOfContents } from "@/app/posts/[slug]/(components)/TableOfContents";
import { notFound } from "next/navigation";
import Script from "next/script";

const getChildrenCodeTag = (node: ReactNode) => {
  if (!node || React.Children.count(node) !== 1) return false;
  const child = React.Children.only(node);
  if (React.isValidElement(child) && child.type === "code") return child;
  else return false;
};

const isValidCodeElement = (
  codeElement: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >,
) => {
  return (
    "props" in codeElement &&
    codeElement.props &&
    typeof codeElement.props === "object" &&
    "className" in codeElement.props &&
    typeof codeElement.props.className === "string" &&
    "children" in codeElement.props
  );
};

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
      title: frontmatter.title,
      description:
        frontmatter.description || `${frontmatter.title}에 대한 글입니다.`,
      keywords: frontmatter.tag,
      authors: [{ name: AUTHOR_NAME }],
      openGraph: {
        title: frontmatter.title,
        description:
          frontmatter.description || `${frontmatter.title}에 대한 글입니다.`,
        type: "article",
        publishedTime: frontmatter.date,
        authors: [AUTHOR_NAME],
        tags: frontmatter.tag,
      },
      twitter: {
        card: "summary_large_image",
        title: frontmatter.title,
        description:
          frontmatter.description || `${frontmatter.title}에 대한 글입니다.`,
      },
    };
  } catch {
    return {
      title: "포스트를 찾을 수 없습니다",
      description: "요청하신 포스트가 존재하지 않거나 삭제되었을 수 있습니다.",
    };
  }
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await fetchSingleBlogPost(`${slug}.md`, true);
  } catch {
    notFound();
  }

  const { content, frontmatter } = post;

  if (!isPostPublished(post)) {
    notFound();
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
  const headingsWithIds = extractHeadingsWithIds(content);

  // heading 인덱스를 추적하기 위한 클로저 생성
  let headingIndex = 0;
  const createHeadingComponent = (
    level: 1 | 2 | 3 | 4 | 5 | 6,
    className?: string,
  ) => {
    return ({ children }: { children?: ReactNode }) => {
      const currentIndex = headingIndex++;
      const headingData = headingsWithIds[currentIndex];
      return (
        <HeadingWithAnchor
          level={level}
          className={className}
          id={headingData?.id || ""}
        >
          {children}
        </HeadingWithAnchor>
      );
    };
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
              <h1 className="break-keep">{frontmatter.title}</h1>
              <Markdown
                components={{
                  h1: createHeadingComponent(1, "mt-30"),
                  h2: createHeadingComponent(2, "mt-24"),
                  h3: createHeadingComponent(3, "mt-16"),
                  h4: createHeadingComponent(4, "mt-12"),
                  img: ({ src, alt, ...props }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={alt || "블로그 이미지"}
                      loading="lazy"
                      {...props}
                    />
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
                    const language = codeProps.className.replace(
                      "language-",
                      "",
                    );

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
