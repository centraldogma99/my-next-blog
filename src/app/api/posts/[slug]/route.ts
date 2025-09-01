import { NextRequest, NextResponse } from "next/server";
import { fetchSingleBlogPost } from "@/utils/api/github";
import { createAuthenticatedHandler, getCommitterInfo } from "@/utils/api";
import {
  generateFrontmatterString,
  isValidFrontmatter,
  type Frontmatter,
} from "@/utils/frontmatter";

interface RouteParams {
  slug: string;
}

// GET: 포스트 조회 (편집용) - 인증 불필요
export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> },
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const { slug } = params;
    const post = await fetchSingleBlogPost(`${slug}.md`, true);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "포스트를 찾을 수 없습니다." },
      { status: 404 },
    );
  }
}

// PUT: 포스트 수정 - 인증 필요
export const PUT = createAuthenticatedHandler<RouteParams>(
  async (context, params) => {
    const { request, octokit, githubConfig, user } = context;

    if (!params) {
      return NextResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { slug } = params;

    const { frontmatter, content, sha } = (await request.json()) as {
      frontmatter: Frontmatter;
      content: string;
      sha: string;
    };

    if (!content || !isValidFrontmatter(frontmatter) || !sha) {
      return NextResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    // frontmatter 객체에서 문자열 생성
    const frontmatterString = generateFrontmatterString(frontmatter);

    // 파일 경로
    const path = `posts/${slug}.md`;

    // 전체 콘텐츠 생성 및 Base64 인코딩
    const fullContent = frontmatterString + content;
    const contentBase64 = Buffer.from(fullContent).toString("base64");

    // 파일 업데이트
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubConfig.owner,
      repo: githubConfig.repo,
      path,
      message: `Update post: ${slug}`,
      content: contentBase64,
      sha,
      committer: getCommitterInfo(user),
    });

    return NextResponse.json({
      message: "포스트가 성공적으로 수정되었습니다.",
      data: response.data,
    });
  },
);

// DELETE: 포스트 삭제 - 인증 필요
export const DELETE = createAuthenticatedHandler<RouteParams>(
  async (context, params) => {
    const { request, octokit, githubConfig, user } = context;

    if (!params) {
      return NextResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { slug } = params;

    const { sha } = (await request.json()) as {
      sha: string;
    };

    if (!sha) {
      return NextResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    // 파일 경로
    const path = `posts/${slug}.md`;

    // 파일 삭제
    const response = await octokit.rest.repos.deleteFile({
      owner: githubConfig.owner,
      repo: githubConfig.repo,
      path,
      message: `Delete post: ${slug}`,
      sha,
      committer: getCommitterInfo(user),
    });

    return NextResponse.json({
      message: "포스트가 성공적으로 삭제되었습니다.",
      data: response.data,
    });
  },
);
