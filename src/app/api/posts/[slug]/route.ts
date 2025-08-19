import { NextRequest, NextResponse } from "next/server";
import { fetchSingleBlogPost } from "@/utils/githubBlogPost";
import { 
  createAuthenticatedHandler,
  getCommitterInfo,
  getFileSHA
} from "@/utils/api";

interface RouteParams {
  slug: string;
}

// GET: 포스트 조회 (편집용) - 인증 불필요
export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
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
      { status: 404 }
    );
  }
};

// PUT: 포스트 수정 - 인증 필요
export const PUT = createAuthenticatedHandler<RouteParams>(async (context, params) => {
  const { request, octokit, githubConfig, user } = context;
  const { slug } = params!;

  const { content } = await request.json();

  if (!content) {
    return NextResponse.json(
      { message: "content는 필수입니다." },
      { status: 400 }
    );
  }

  // 파일 경로
  const path = `posts/${slug}.md`;

  // 현재 파일의 SHA 가져오기
  const sha = await getFileSHA(octokit, githubConfig, path);
  if (!sha) {
    return NextResponse.json(
      { message: "파일 정보를 가져올 수 없습니다." },
      { status: 500 }
    );
  }

  // Base64 인코딩
  const contentBase64 = Buffer.from(content).toString("base64");

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
    data: response.data
  });
});

// DELETE: 포스트 삭제 - 인증 필요
export const DELETE = createAuthenticatedHandler<RouteParams>(async (context, params) => {
  const { octokit, githubConfig, user } = context;
  const { slug } = params!;

  // 파일 경로
  const path = `posts/${slug}.md`;

  // 현재 파일의 SHA 가져오기
  const sha = await getFileSHA(octokit, githubConfig, path);
  if (!sha) {
    return NextResponse.json(
      { message: "파일 정보를 가져올 수 없습니다." },
      { status: 500 }
    );
  }

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
    data: response.data
  });
});