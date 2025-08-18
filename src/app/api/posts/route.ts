import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Octokit } from "octokit";
import { getToken } from "next-auth/jwt";

// 환경 변수에서 GitHub 리포지토리 정보 가져오기
const REPO_OWNER = process.env.GITHUB_REPO_OWNER; // 리포지토리 소유자
const REPO_NAME = process.env.GITHUB_REPO_NAME;

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "인증되지 않은 요청입니다." },
        { status: 401 },
      );
    }

    // JWT 토큰에서 액세스 토큰 가져오기 (서버 측에서만)
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token?.accessToken) {
      return NextResponse.json(
        { message: "인증 토큰이 없습니다." },
        { status: 401 },
      );
    }

    // 현재 로그인한 사용자의 GitHub 유저명을 POST_WRITER로 사용
    const octokit = new Octokit({
      auth: token.accessToken as string,
    });

    const { slug, content } = await request.json();

    if (!slug || !content) {
      return NextResponse.json(
        { message: "slug와 content는 필수입니다." },
        { status: 400 },
      );
    }

    // 파일 경로
    const path = `posts/${slug}.md`;

    // Base64 인코딩
    const contentBase64 = Buffer.from(content).toString("base64");

    // 환경 변수 검증
    if (!REPO_OWNER || !REPO_NAME) {
      return NextResponse.json(
        { message: "GitHub 리포지토리 설정이 필요합니다." },
        { status: 500 },
      );
    }

    try {
      // 파일 생성
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER, // 리포지토리 소유자
        repo: REPO_NAME,
        path,
        message: `Add new post: ${slug}`,
        content: contentBase64,
        committer: {
          name: session.user?.name || "Anonymous",
          email: session.user?.email || "anonymous@example.com",
        },
      });

      return NextResponse.json({
        message: "포스트가 성공적으로 생성되었습니다.",
        data: response.data,
      });
    } catch (error) {
      // 이미 파일이 존재하는 경우
      if (error instanceof Error && "status" in error && error.status === 422) {
        return NextResponse.json(
          { message: "이미 존재하는 파일명입니다." },
          { status: 409 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "포스트 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
