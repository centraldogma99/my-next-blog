import type { GetContentsDetailResponse } from "@/types/githubAPI/getContentsDetail";
import { decodeBase64Content } from "@/utils/decodeBase64Content";
import { extractTitleFromMarkdown } from "@/utils/extractTitleFromMarkdown";
import { fetchBlogPostsGithubAPI } from "@/utils/fetchGithubAPI";
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

  return (
    <div className="window" style={{ width: "1080px" }}>
      <div className="title-bar">
        <div className="title-bar-text">
          {extractTitleFromMarkdown(contents)}
        </div>
      </div>

      <div className="window-body">
        <Markdown>{contents}</Markdown>
      </div>
    </div>
  );
}
