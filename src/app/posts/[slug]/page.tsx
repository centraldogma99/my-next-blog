import type { GetContentsDetailResponse } from "@/types/githubAPI/getContentsDetail";
import { decodeBase64Content } from "@/utils/decodeBase64Content";
import { extractTitleFromMarkdown } from "@/utils/extractTitleFromMarkdown";
import { fetchBlogPostsGithubAPI } from "@/utils/fetchGithubAPI";
import { parseFrontmatter } from "@/utils/parseFrontmatter";
import { CodeBlock } from "@/components/CodeBlock";
import Markdown from "react-markdown";

const fetchPostContents = async (slug: string) => {
  const data = await fetchBlogPostsGithubAPI<GetContentsDetailResponse>(
    `/contents/${slug}`,
  );
  return decodeBase64Content(data.content);
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
          code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            console.log(match, className);

            return match ? (
              <CodeBlock className={className}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </article>
  );
}
