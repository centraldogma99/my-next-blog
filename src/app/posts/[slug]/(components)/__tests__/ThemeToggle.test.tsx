import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

const renderWithThemeProvider = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe("ThemeToggle", () => {
  it("다크 모드일 때 달 아이콘을 표시한다", () => {
    renderWithThemeProvider(<ThemeToggle />);

    const button = screen.getByRole("button");
    // SVG 아이콘이 있는지 확인
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "현재: 다크 모드");
  });

  it("버튼 클릭 시 테마가 변경된다", () => {
    renderWithThemeProvider(<ThemeToggle />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    // SVG 아이콘이 여전히 있는지 확인
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "현재: 라이트 모드");
  });

  it("라이트 모드에서 다크 모드로 전환된다", () => {
    renderWithThemeProvider(<ThemeToggle />);

    const button = screen.getByRole("button");

    fireEvent.click(button);
    fireEvent.click(button);

    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "현재: 다크 모드");
  });

  it("키보드 포커스가 가능하다", () => {
    renderWithThemeProvider(<ThemeToggle />);

    const button = screen.getByRole("button");
    button.focus();

    expect(button).toHaveFocus();

    // 포커스된 상태에서 클릭도 가능해야 함
    fireEvent.click(button);
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "현재: 라이트 모드");
  });

  it("접근성 속성이 올바르게 설정되어 있다", () => {
    renderWithThemeProvider(<ThemeToggle />);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("title");
    expect(button.getAttribute("title")).toContain("현재:");
  });
});
