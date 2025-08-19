import { NextResponse } from "next/server";
import { 
  createAuthenticatedHandler,
  getCommitterInfo
} from "@/utils/api";

export const POST = createAuthenticatedHandler(async (context) => {
  const { request, octokit, githubConfig, user } = context;
  
  const { slug, content } = await request.json();

  if (!slug || !content) {
    return NextResponse.json(
      { message: "slug와 content는 필수입니다." },
      { status: 400 }
    );
  }

  // 파일 경로
  const path = `posts/${slug}.md`;

  // Base64 인코딩
  const contentBase64 = Buffer.from(content).toString("base64");

  try {
    // 파일 생성
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubConfig.owner,
      repo: githubConfig.repo,
      path,
      message: `Add new post: ${slug}`,
      content: contentBase64,
      committer: getCommitterInfo(user),
    });

    return NextResponse.json({
      message: "포스트가 성공적으로 생성되었습니다.",
      data: response.data
    });
  } catch (error) {
    // 이미 파일이 존재하는 경우
    if (error instanceof Error && "status" in error && error.status === 422) {
      return NextResponse.json(
        { message: "이미 존재하는 파일명입니다." },
        { status: 409 }
      );
    }
    throw error;
  }
});