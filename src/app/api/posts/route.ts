import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Octokit } from "octokit";

const REPO_OWNER = "centraldogma99";
const REPO_NAME = "dogma-blog-posts";

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { message: "인증되지 않은 요청입니다." },
        { status: 401 }
      );
    }

    const { slug, content } = await request.json();

    if (!slug || !content) {
      return NextResponse.json(
        { message: "slug와 content는 필수입니다." },
        { status: 400 }
      );
    }

    // Octokit 인스턴스 생성
    const octokit = new Octokit({
      auth: session.accessToken,
    });

    // 파일 경로
    const path = `posts/${slug}.md`;

    // Base64 인코딩
    const contentBase64 = Buffer.from(content).toString("base64");

    try {
      // 파일 생성
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
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
    } catch (error: any) {
      // 이미 파일이 존재하는 경우
      if (error.status === 422) {
        return NextResponse.json(
          { message: "이미 존재하는 파일명입니다." },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "포스트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}