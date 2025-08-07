import {
  CodeBlock,
  isSupportedLanguage,
} from "@/app/posts/[slug]/(components)/CodeBlock";
import { HashScrollHandler } from "@/app/posts/[slug]/(components)/HashScrollHandler";
import { HeadingWithAnchor } from "@/app/posts/[slug]/(components)/HeadingWithAnchor";
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
    const post = await fetchSingleBlogPost(slug, false);
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
    post = await fetchSingleBlogPost(slug, true);
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

  return (
    <>
      <HashScrollHandler />
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="h-[calc(100vh_-_64px)]">
        <div className="grid lg:grid-cols-[1fr_3fr] gap-8 h-full">
          <TableOfContents content={content} className="py-4" />
          <div className="py-6 h-full overflow-y-auto lg:col-start-2 pt-12 pb-24">
            <h1>{frontmatter.title}</h1>
            <Markdown
              components={{
                h1: ({ children }) => (
                  <HeadingWithAnchor level={1} className="mt-30">
                    {children}
                  </HeadingWithAnchor>
                ),
                h2: ({ children }) => (
                  <HeadingWithAnchor level={2} className="mt-24">
                    {children}
                  </HeadingWithAnchor>
                ),
                h3: ({ children }) => (
                  <HeadingWithAnchor level={3} className="mt-16">
                    {children}
                  </HeadingWithAnchor>
                ),
                h4: ({ children }) => (
                  <HeadingWithAnchor level={4} className="mt-12">
                    {children}
                  </HeadingWithAnchor>
                ),
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
      </article>
    </>
  );
}
