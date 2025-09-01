import { NextResponse } from "next/server";
import { fetchSingleBlogPost } from "@/utils/api/github";
import {
  createAuthenticatedHandler,
  getCommitterInfo,
  getFileSHA,
} from "@/utils/api";
import { generateFrontmatterString } from "@/utils/frontmatter";

interface RouteParams {
  slug: string;
}

export const POST = createAuthenticatedHandler<RouteParams>(
  async (context, params) => {
    const { octokit, githubConfig, user } = context;

    if (!params || !params.slug) {
      return NextResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { slug } = params;
    const fileName = `${slug}.md`;

    // 현재 포스트 내용 가져오기
    const post = await fetchSingleBlogPost(fileName, true);
    const { content, frontmatter } = post;

    // draft 상태 토글
    const newDraftState = !frontmatter.draft;

    // generateFrontmatterString 함수로 frontmatter 생성
    const updatedFrontmatter = generateFrontmatterString({
      title: frontmatter.title,
      date: frontmatter.date,
      tag: frontmatter.tag || [],
      description: frontmatter.description,
      draft: newDraftState,
    });

    const updatedContent = `${updatedFrontmatter}${content}`;

    // 파일 경로
    const path = `posts/${fileName}`;

    // 현재 파일의 SHA 가져오기
    const sha = await getFileSHA(octokit, githubConfig, path);
    if (!sha) {
      return NextResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    // Base64 인코딩
    const contentBase64 = Buffer.from(updatedContent).toString("base64");

    // 파일 업데이트
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubConfig.owner,
      repo: githubConfig.repo,
      path,
      message: `Toggle draft status for ${fileName}`,
      content: contentBase64,
      sha,
      committer: getCommitterInfo(user),
    });

    return NextResponse.json({
      message: "Draft 상태가 변경되었습니다.",
      draft: newDraftState,
    });
  },
);
