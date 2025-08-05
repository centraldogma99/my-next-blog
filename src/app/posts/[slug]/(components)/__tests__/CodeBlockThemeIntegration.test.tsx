import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { CodeBlock } from "../CodeBlock";

vi.mock("shiki", () => ({
  codeToHast: vi.fn(),
  bundledLanguages: {
    javascript: {},
  },
}));

vi.mock("hast-util-to-jsx-runtime", () => ({
  toJsxRuntime: vi.fn(),
}));

const TestComponentWithCodeBlock = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme("light")}>라이트 모드</button>
      <button onClick={() => setTheme("dark")}>다크 모드</button>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="code-wrapper">
        {/* CodeBlock은 async 컴포넌트이므로 실제 앱에서는 Suspense로 감싸야 함 */}
      </div>
    </div>
  );
};

describe("CodeBlock과 ThemeContext 통합 테스트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("테마 변경 시 CodeBlock이 올바른 테마 설정을 사용한다", async () => {
    const mockHast = { type: "element", tagName: "pre" };
    const mockJsxElement = <pre className="shiki">highlighted code</pre>;

    const { codeToHast } = await import("shiki");
    const { toJsxRuntime } = await import("hast-util-to-jsx-runtime");

    vi.mocked(codeToHast).mockResolvedValue(mockHast as never);
    vi.mocked(toJsxRuntime).mockReturnValue(mockJsxElement);

    render(
      <ThemeProvider>
        <TestComponentWithCodeBlock />
      </ThemeProvider>,
    );

    // 초기 다크모드 상태 확인
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");

    // CodeBlock 렌더링 시 다크모드 설정 확인
    await CodeBlock({
      children: 'const test = "hello"',
      language: "javascript",
    });

    expect(codeToHast).toHaveBeenCalledWith('const test = "hello"', {
      lang: "javascript",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: "dark",
    });

    // 라이트 모드로 변경
    fireEvent.click(screen.getByText("라이트 모드"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });

  it("다크/라이트 테마 모두에서 동일한 테마 설정을 사용한다", async () => {
    const { codeToHast } = await import("shiki");
    const { toJsxRuntime } = await import("hast-util-to-jsx-runtime");

    const mockHast = { type: "element", tagName: "pre" };
    const mockJsxElement = <pre className="shiki">code</pre>;

    vi.mocked(codeToHast).mockResolvedValue(mockHast as never);
    vi.mocked(toJsxRuntime).mockReturnValue(mockJsxElement);

    // 다크모드와 라이트모드 둘 다 같은 테마 설정을 사용하는지 확인
    const themes = {
      light: "github-light",
      dark: "github-dark",
    };

    await CodeBlock({
      children: "test code",
      language: "javascript",
    });

    expect(codeToHast).toHaveBeenCalledWith("test code", {
      lang: "javascript",
      themes,
      defaultColor: "dark",
    });
  });

  it("CSS 변수를 통해 테마가 적용되는지 확인", () => {
    const mockDocumentElement = {
      classList: {
        remove: vi.fn(),
        add: vi.fn(),
      },
    };

    Object.defineProperty(document, "documentElement", {
      value: mockDocumentElement,
      writable: true,
    });

    render(
      <ThemeProvider>
        <TestComponentWithCodeBlock />
      </ThemeProvider>,
    );

    // 라이트 모드로 변경
    fireEvent.click(screen.getByText("라이트 모드"));

    // documentElement에 적절한 클래스가 추가되었는지 확인
    expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
      "light",
      "dark",
    );
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith("light");

    // 다시 다크 모드로 변경
    fireEvent.click(screen.getByText("다크 모드"));

    expect(mockDocumentElement.classList.remove).toHaveBeenLastCalledWith(
      "light",
      "dark",
    );
    expect(mockDocumentElement.classList.add).toHaveBeenLastCalledWith("dark");
  });
});
