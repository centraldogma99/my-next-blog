import { NextResponse } from "next/server";
import { fetchSingleBlogPost } from "@/utils/githubBlogPost";
import { 
  createAuthenticatedHandler,
  getCommitterInfo,
  getFileSHA
} from "@/utils/api";

interface RouteParams {
  slug: string;
}

export const POST = createAuthenticatedHandler<RouteParams>(async (context, params) => {
  const { octokit, githubConfig, user } = context;
  
  if (!params) {
    return NextResponse.json(
      { message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }
  
  const { slug } = params;
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

  // 파일 경로
  const path = `posts/${fileName}`;

  // 현재 파일의 SHA 가져오기
  const sha = await getFileSHA(octokit, githubConfig, path);
  if (!sha) {
    throw new Error("파일 정보를 가져올 수 없습니다.");
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
});