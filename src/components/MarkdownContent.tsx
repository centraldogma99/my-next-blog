/* eslint-disable react/display-name */
import React, { type ReactNode } from "react";
import Markdown from "react-markdown";
import {
  CodeBlock,
  isSupportedLanguage,
} from "@/app/posts/[slug]/(components)/CodeBlock";
import { HeadingWithAnchor } from "@/app/posts/[slug]/(components)/HeadingWithAnchor";
import type { HeadingWithId } from "@/utils/contentProcessing";

interface MarkdownContentProps {
  content: string;
  headingsWithIds: HeadingWithId[];
}

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

export default function MarkdownContent({ 
  content, 
  headingsWithIds 
}: MarkdownContentProps) {
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
  );
}