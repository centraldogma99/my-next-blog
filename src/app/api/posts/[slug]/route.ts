import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Octokit } from "octokit";
import { fetchSingleBlogPost } from "@/utils/githubBlogPost";
import { getToken } from "next-auth/jwt";

// 환경 변수에서 GitHub 리포지토리 정보 가져오기
const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;

// GET: 포스트 조회 (편집용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
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

// PUT: 포스트 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "인증되지 않은 요청입니다." },
        { status: 401 },
      );
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return NextResponse.json(
        { message: "인증 토큰이 없습니다." },
        { status: 401 },
      );
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { message: "content는 필수입니다." },
        { status: 400 },
      );
    }

    // Octokit 인스턴스 생성
    const octokit = new Octokit({
      auth: token.accessToken as string,
    });

    // 파일 경로
    const path = `posts/${slug}.md`;

    // 환경 변수 검증
    if (!REPO_OWNER || !REPO_NAME) {
      return NextResponse.json(
        { message: "GitHub 리포지토리 설정이 필요합니다." },
        { status: 500 },
      );
    }

    // 현재 파일의 SHA 가져오기
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });

    if (!("sha" in fileData)) {
      return NextResponse.json(
        { message: "파일 정보를 가져올 수 없습니다." },
        { status: 500 },
      );
    }

    // Base64 인코딩
    const contentBase64 = Buffer.from(content).toString("base64");

    // 파일 업데이트
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message: `Update post: ${slug}`,
      content: contentBase64,
      sha: fileData.sha,
      committer: {
        name: session.user?.name || "Anonymous",
        email: session.user?.email || "anonymous@example.com",
      },
    });

    return NextResponse.json({
      message: "포스트가 성공적으로 수정되었습니다.",
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "포스트 수정 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// DELETE: 포스트 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
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

    // Octokit 인스턴스 생성
    const octokit = new Octokit({
      auth: token.accessToken as string,
    });

    // 파일 경로
    const path = `posts/${slug}.md`;

    // 환경 변수 검증
    if (!REPO_OWNER || !REPO_NAME) {
      return NextResponse.json(
        { message: "GitHub 리포지토리 설정이 필요합니다." },
        { status: 500 },
      );
    }

    // 현재 파일의 SHA 가져오기
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });

    if (!("sha" in fileData)) {
      return NextResponse.json(
        { message: "파일 정보를 가져올 수 없습니다." },
        { status: 500 },
      );
    }

    // 파일 삭제
    const response = await octokit.rest.repos.deleteFile({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message: `Delete post: ${slug}`,
      sha: fileData.sha,
      committer: {
        name: session.user?.name || "Anonymous",
        email: session.user?.email || "anonymous@example.com",
      },
    });

    return NextResponse.json({
      message: "포스트가 성공적으로 삭제되었습니다.",
      data: response.data,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "포스트 삭제 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
