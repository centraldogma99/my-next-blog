import { CodeBlock, isSupportedLanguage } from "@/components/CodeBlock";
import type { GetContentsDetailResponse } from "@/types/githubAPI/getContentsDetail";
import { decodeBase64Content } from "@/utils/decodeBase64Content";
import { extractTitleFromMarkdown } from "@/utils/extractTitleFromMarkdown";
import { fetchBlogPostsGithubAPI } from "@/utils/fetchGithubAPI";
import { parseFrontmatter } from "@/utils/parseFrontmatter";
import type { ReactNode } from "react";
import React from "react";
import Markdown from "react-markdown";

const fetchPostContents = async (slug: string) => {
  const data = await fetchBlogPostsGithubAPI<GetContentsDetailResponse>(
    `/contents/${slug}`,
  );
  return decodeBase64Content(data.content);
};

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

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contents = await fetchPostContents(slug);
  const { content } = parseFrontmatter(contents);

  return (
    <article>
      <h1>{extractTitleFromMarkdown(contents)}</h1>
      <Markdown
        components={{
          h1: ({ children }) => <h1 className="mt-12">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-10">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-8">{children}</h3>,
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
    </article>
  );
}
