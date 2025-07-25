interface ParseResult {
  frontmatter: Frontmatter;
  content: string;
}

export function parseFrontmatter(markdownContent: string): ParseResult {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdownContent.match(frontmatterRegex);

  if (!match) {
    throw new Error("Invalid frontmatter");
  }

  const frontmatterStr = match[1];
  const content = match[2];
  const frontmatter: {
    [key: string]: unknown;
  } = {};

  // YAML 형태의 frontmatter를 파싱
  const lines = frontmatterStr.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    // 배열 처리 (tag: - blog - gatsby 형태)
    if (trimmedLine.startsWith("-")) {
      const value = trimmedLine.slice(1).trim();
      const lastKey = Object.keys(frontmatter).pop();
      if (lastKey && Array.isArray(frontmatter[lastKey])) {
        (frontmatter[lastKey] as string[]).push(value);
      }
      continue;
    }

    // key: value 처리
    const colonIndex = trimmedLine.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmedLine.slice(0, colonIndex).trim();
    let value: string | boolean = trimmedLine.slice(colonIndex + 1).trim();

    // 따옴표 제거
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }

    // 다음 줄이 배열인지 확인
    const nextLineIndex = lines.indexOf(line) + 1;
    if (
      nextLineIndex < lines.length &&
      lines[nextLineIndex].trim().startsWith("-")
    ) {
      frontmatter[key] = [];
    } else {
      // boolean 값 처리
      if (value === "true") value = true;
      else if (value === "false") value = false;

      frontmatter[key] = value;
    }
  }

  if (!isValidFrontmatter(frontmatter)) {
    throw new Error("Invalid frontmatter");
  }

  return {
    frontmatter,
    content: content.trim(),
  };
}

export interface Frontmatter {
  title: string;
  subtitle?: string;
  date: string;
  draft: boolean;
  tag: string[];
}

export const isValidFrontmatter = (
  frontmatter: object,
): frontmatter is Frontmatter => {
  return (
    "title" in frontmatter &&
    "date" in frontmatter &&
    "draft" in frontmatter &&
    "tag" in frontmatter &&
    typeof frontmatter.title === "string" &&
    typeof frontmatter.date === "string" &&
    typeof frontmatter.draft === "boolean" &&
    Array.isArray(frontmatter.tag)
  );
};
