import { describe, it, expect } from "vitest";
import { decodeBase64String } from "../decodeBase64String";

describe("decodeBase64Content", () => {
  it("유효한 Base64 문자열을 디코딩한다", () => {
    const base64 = Buffer.from("Hello World", "utf-8").toString("base64");

    expect(decodeBase64String(base64)).toBe("Hello World");
  });

  it("한글 텍스트를 올바르게 디코딩한다", () => {
    const koreanText = "안녕하세요, 세계!";
    const base64 = Buffer.from(koreanText, "utf-8").toString("base64");

    expect(decodeBase64String(base64)).toBe(koreanText);
  });

  it("마크다운 컨텐츠를 디코딩한다", () => {
    const markdown = `# 제목

이것은 **굵은 글씨**입니다.

- 목록 1
- 목록 2`;
    const base64 = Buffer.from(markdown, "utf-8").toString("base64");

    expect(decodeBase64String(base64)).toBe(markdown);
  });

  it("빈 문자열을 디코딩한다", () => {
    const base64 = Buffer.from("", "utf-8").toString("base64");

    expect(decodeBase64String(base64)).toBe("");
  });

  it("Buffer 클래스가 존재하고 정상 작동한다", () => {
    const text = "Hello World";
    const base64 = Buffer.from(text, "utf-8").toString("base64");

    expect(decodeBase64String(base64)).toBe(text);
    expect(typeof Buffer).toBe("function");
  });
});
