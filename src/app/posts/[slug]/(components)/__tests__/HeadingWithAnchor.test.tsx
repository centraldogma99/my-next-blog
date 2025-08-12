import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HeadingWithAnchor } from "../HeadingWithAnchor";

// scrollToElement 모킹
vi.mock("@/utils/scrollToElement", () => ({
  scrollToElement: vi.fn(),
}));

describe("HeadingWithAnchor", () => {
  beforeEach(() => {
    // window.history.pushState 모킹
    window.history.pushState = vi.fn();
    // document.getElementById 모킹
    document.getElementById = vi.fn().mockReturnValue({
      scrollIntoView: vi.fn(),
    });
  });

  it("지정된 레벨의 헤딩을 렌더링해야 함", () => {
    render(
      <HeadingWithAnchor level={1} id="test-id">
        테스트 헤딩
      </HeadingWithAnchor>
    );
    
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("테스트 헤딩");
  });

  it("각 헤딩 레벨(1-6)을 올바르게 렌더링해야 함", () => {
    const levels = [1, 2, 3, 4, 5, 6] as const;
    
    levels.forEach((level) => {
      const { rerender } = render(
        <HeadingWithAnchor level={level} id={`test-id-${level}`}>
          헤딩 레벨 {level}
        </HeadingWithAnchor>
      );
      
      const heading = screen.getByRole("heading", { level });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(`헤딩 레벨 ${level}`);
      
      rerender(<></>); // 다음 테스트를 위해 정리
    });
  });

  it("제공된 ID를 헤딩 요소에 설정해야 함", () => {
    render(
      <HeadingWithAnchor level={2} id="custom-id">
        커스텀 ID 헤딩
      </HeadingWithAnchor>
    );
    
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "custom-id");
  });

  it("className이 제공되면 적용해야 함", () => {
    render(
      <HeadingWithAnchor level={3} id="test-id" className="custom-class">
        스타일 적용 헤딩
      </HeadingWithAnchor>
    );
    
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass("custom-class");
    expect(heading).toHaveClass("group"); // 기본 클래스도 유지
  });

  it("헤딩 내부에 앵커 링크를 포함해야 함", () => {
    render(
      <HeadingWithAnchor level={2} id="anchor-test">
        앵커 테스트
      </HeadingWithAnchor>
    );
    
    const link = screen.getByRole("link", { name: "앵커 테스트 섹션으로 이동" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#anchor-test");
  });

  it("앵커 클릭 시 스크롤과 URL 업데이트가 실행되어야 함", async () => {
    const user = userEvent.setup();
    const { scrollToElement } = await import("@/utils/scrollToElement");
    
    render(
      <HeadingWithAnchor level={2} id="scroll-test">
        스크롤 테스트
      </HeadingWithAnchor>
    );
    
    const link = screen.getByRole("link", { name: "스크롤 테스트 섹션으로 이동" });
    await user.click(link);
    
    expect(scrollToElement).toHaveBeenCalledWith("scroll-test");
    expect(window.history.pushState).toHaveBeenCalledWith(
      null,
      "",
      "#scroll-test"
    );
  });

  it("특수문자가 포함된 ID를 올바르게 인코딩해야 함", () => {
    render(
      <HeadingWithAnchor level={2} id="한글-테스트">
        한글 ID 테스트
      </HeadingWithAnchor>
    );
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `#${encodeURIComponent("한글-테스트")}`);
  });

  it("복잡한 children (React 노드)를 올바르게 렌더링해야 함", () => {
    render(
      <HeadingWithAnchor level={2} id="complex-children">
        <span>복잡한</span> <strong>컨텐츠</strong>
      </HeadingWithAnchor>
    );
    
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("복잡한 컨텐츠");
  });

  it("앵커 링크에 호버 스타일 클래스가 적용되어야 함", () => {
    render(
      <HeadingWithAnchor level={2} id="hover-test">
        호버 테스트
      </HeadingWithAnchor>
    );
    
    const link = screen.getByRole("link");
    expect(link).toHaveClass("no-underline");
    expect(link).toHaveClass("hover:underline");
    expect(link).toHaveClass("text-inherit");
  });
});