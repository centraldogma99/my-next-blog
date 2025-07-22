export function extractTitleFromMarkdown(markdownContent: string) {
  // frontmatter 영역만 추출
  const frontmatterMatch = markdownContent.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return "";

  const frontmatter = frontmatterMatch[1];

  // title 라인 찾기
  const titleMatch = frontmatter.match(/^title:\s*['"]?([^'"]+)['"]?$/m);
  return titleMatch ? titleMatch[1] : "";
}
