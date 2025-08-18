import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchSingleBlogPost } from "@/utils/githubBlogPost";

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

    // GitHub API로 파일 업데이트
    const githubToken = process.env.GITHUB_API_KEY;
    if (!githubToken) {
      throw new Error("GitHub API key not configured");
    }

    // 먼저 현재 파일의 SHA 가져오기
    const getFileResponse = await fetch(
      `https://api.github.com/repos/centraldogma99/dogma-blog-posts/contents/posts/${fileName}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!getFileResponse.ok) {
      throw new Error("Failed to fetch file from GitHub");
    }

    const fileData = await getFileResponse.json();

    // 파일 업데이트
    const updateResponse = await fetch(
      `https://api.github.com/repos/centraldogma99/dogma-blog-posts/contents/posts/${fileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Toggle draft status for ${fileName}`,
          content: Buffer.from(updatedContent).toString("base64"),
          sha: fileData.sha,
        }),
      },
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(error.message || "Failed to update file on GitHub");
    }

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
