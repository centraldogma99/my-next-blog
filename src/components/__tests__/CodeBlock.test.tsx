import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { CodeBlock, isSupportedLanguage } from "../CodeBlock";

vi.mock("shiki", () => ({
  codeToHast: vi.fn(),
  bundledLanguages: {
    javascript: {},
    typescript: {},
    python: {},
    css: {},
  },
}));

vi.mock("hast-util-to-jsx-runtime", () => ({
  toJsxRuntime: vi.fn(),
}));

describe("CodeBlock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isSupportedLanguage", () => {
    it("지원되는 언어에 대해 true를 반환한다", () => {
      expect(isSupportedLanguage("javascript")).toBe(true);
      expect(isSupportedLanguage("typescript")).toBe(true);
      expect(isSupportedLanguage("python")).toBe(true);
    });

    it("지원되지 않는 언어에 대해 false를 반환한다", () => {
      expect(isSupportedLanguage("unsupported-lang")).toBe(false);
      expect(isSupportedLanguage("random")).toBe(false);
    });
  });

  describe("CodeBlock 컴포넌트", () => {
    it("성공적으로 코드를 하이라이팅한다", async () => {
      const mockHast = { type: "element", tagName: "pre" };
      const mockJsxElement = <pre>highlighted code</pre>;

      const { codeToHast } = await import("shiki");
      const { toJsxRuntime } = await import("hast-util-to-jsx-runtime");

      vi.mocked(codeToHast).mockResolvedValue(mockHast as never);
      vi.mocked(toJsxRuntime).mockReturnValue(mockJsxElement);

      const result = await CodeBlock({
        children: 'const hello = "world"',
        language: "javascript",
      });

      expect(codeToHast).toHaveBeenCalledWith('const hello = "world"', {
        lang: "javascript",
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: "dark",
      });

      expect(toJsxRuntime).toHaveBeenCalledWith(
        mockHast,
        expect.objectContaining({
          Fragment: expect.anything(),
          jsx: expect.any(Function),
          jsxs: expect.any(Function),
        }),
      );

      expect(result).toBe(mockJsxElement);
    });

    it("에러 발생 시 폴백으로 일반 code 요소를 반환한다", async () => {
      const { codeToHast } = await import("shiki");
      vi.mocked(codeToHast).mockRejectedValue(new Error("Highlighting failed"));

      const { container } = render(
        await CodeBlock({
          children: 'const hello = "world"',
          language: "javascript",
        }),
      );

      const codeElement = container.querySelector("code");
      expect(codeElement).toBeTruthy();
      expect(codeElement?.textContent).toBe('const hello = "world"');
    });

    it("다양한 언어를 지원한다", async () => {
      const mockHast = { type: "element", tagName: "pre" };
      const mockJsxElement = <pre>highlighted python</pre>;

      const { codeToHast } = await import("shiki");
      const { toJsxRuntime } = await import("hast-util-to-jsx-runtime");

      vi.mocked(codeToHast).mockResolvedValue(mockHast as never);
      vi.mocked(toJsxRuntime).mockReturnValue(mockJsxElement);

      await CodeBlock({
        children: 'print("Hello, World!")',
        language: "python",
      });

      expect(codeToHast).toHaveBeenCalledWith('print("Hello, World!")', {
        lang: "python",
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: "dark",
      });
    });

    it("빈 코드 문자열도 처리한다", async () => {
      const mockHast = { type: "element", tagName: "pre" };
      const mockJsxElement = <pre></pre>;

      const { codeToHast } = await import("shiki");
      const { toJsxRuntime } = await import("hast-util-to-jsx-runtime");

      vi.mocked(codeToHast).mockResolvedValue(mockHast as never);
      vi.mocked(toJsxRuntime).mockReturnValue(mockJsxElement);

      const result = await CodeBlock({
        children: "",
        language: "javascript",
      });

      expect(codeToHast).toHaveBeenCalledWith("", expect.any(Object));
      expect(result).toBe(mockJsxElement);
    });
  });
});
