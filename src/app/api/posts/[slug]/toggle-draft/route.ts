import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchSingleBlogPost } from "@/utils/githubBlogPost";
import { Octokit } from "octokit";
import { getToken } from "next-auth/jwt";

// 환경 변수에서 GitHub 리포지토리 정보 가져오기
const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    // JWT 토큰에서 액세스 토큰 가져오기 (서버 측에서만)
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return NextResponse.json(
        { message: "인증 토큰이 없습니다." },
        { status: 401 },
      );
    }

    const { slug } = await params;
    const fileName = `${slug}.md`;

    // 현재 포스트 내용 가져오기
    const post = await fetchSingleBlogPost(fileName, true);
    const { content, frontmatter } = post;

    // draft 상태 토글
    const newDraftState = !frontmatter.draft;

    // frontmatter 업데이트
    const frontmatterLines = [
      "---",
      `title: "${frontmatter.title}"`,
      `date: "${frontmatter.date}"`,
    ];

    // 태그 추가
    if (frontmatter.tag && frontmatter.tag.length > 0) {
      frontmatterLines.push("tag:");
      frontmatter.tag.forEach((tag: string) => {
        frontmatterLines.push(`  - ${tag}`);
      });
    }

    // 부제목 추가 (있는 경우)
    if (frontmatter.subtitle) {
      frontmatterLines.push(`subtitle: "${frontmatter.subtitle}"`);
    }

    // draft 상태 추가
    frontmatterLines.push(`draft: ${newDraftState}`);
    frontmatterLines.push("---");

    const updatedContent = `${frontmatterLines.join("\n")}\n\n${content}`;

    // 환경 변수 검증
    if (!REPO_OWNER || !REPO_NAME) {
      return NextResponse.json(
        { message: "GitHub 리포지토리 설정이 필요합니다." },
        { status: 500 },
      );
    }

    // Octokit 인스턴스 생성
    const octokit = new Octokit({
      auth: token.accessToken as string,
    });

    // 파일 경로
    const path = `posts/${fileName}`;

    // 현재 파일의 SHA 가져오기
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });

    if (!("sha" in fileData)) {
      throw new Error("파일 정보를 가져올 수 없습니다.");
    }

    // Base64 인코딩
    const contentBase64 = Buffer.from(updatedContent).toString("base64");

    // 파일 업데이트
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message: `Toggle draft status for ${fileName}`,
      content: contentBase64,
      sha: fileData.sha,
      committer: {
        name: session.user?.name || "Anonymous",
        email: session.user?.email || "anonymous@example.com",
      },
    });

    return NextResponse.json({
      message: "Draft 상태가 변경되었습니다.",
      draft: newDraftState,
    });
  } catch (error) {
    console.error("Error toggling draft:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Draft 상태 변경 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
