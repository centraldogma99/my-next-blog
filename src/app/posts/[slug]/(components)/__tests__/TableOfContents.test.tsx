import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TableOfContents } from "../TableOfContents";

// scrollToElement 모킹
vi.mock("@/utils/scrollToElement", () => ({
  scrollToElement: vi.fn(),
}));

// Heading 타입 정의
interface Heading {
  id: string;
  text: string;
  level: number;
}

describe("TableOfContents", () => {
  const mockHeadings: Heading[] = [
    { id: "introduction", text: "소개", level: 1 },
    { id: "getting-started", text: "시작하기", level: 2 },
    { id: "installation", text: "설치", level: 3 },
    { id: "configuration", text: "설정", level: 3 },
    { id: "advanced", text: "고급 기능", level: 2 },
    { id: "api-reference", text: "API 레퍼런스", level: 4 },
  ];

  beforeEach(() => {
    // window.history.pushState 모킹
    window.history.pushState = vi.fn();
    
    // IntersectionObserver 모킹
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver as any;
  });
  
  afterEach(() => {
    // DOM 정리
    document.body.innerHTML = '';
  });

  it("헤딩이 없을 때 null을 반환해야 함", () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("제공된 헤딩들을 목록으로 렌더링해야 함", () => {
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    mockHeadings.forEach((heading) => {
      const links = screen.getAllByText(heading.text);
      expect(links.length).toBeGreaterThan(0);
    });
  });

  it("헤딩 레벨에 따라 적절한 들여쓰기를 적용해야 함", () => {
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    const level3Items = screen.getAllByText("설치");
    const level3Item = level3Items[0].closest("li");
    expect(level3Item).toHaveClass("pl-4");
    
    const level4Items = screen.getAllByText("API 레퍼런스");
    const level4Item = level4Items[0].closest("li");
    expect(level4Item).toHaveClass("pl-8");
  });

  it("각 헤딩 링크가 올바른 href를 가져야 함", () => {
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    mockHeadings.forEach((heading) => {
      const links = screen.getAllByText(heading.text);
      const link = links[0].closest("a");
      expect(link).toHaveAttribute("href", `#${encodeURIComponent(heading.id)}`);
    });
  });

  it("헤딩 클릭 시 스크롤과 URL 업데이트가 실행되어야 함", async () => {
    const user = userEvent.setup();
    const { scrollToElement } = await import("@/utils/scrollToElement");
    
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    const links = screen.getAllByText("시작하기");
    await user.click(links[0]);
    
    expect(scrollToElement).toHaveBeenCalledWith("getting-started");
    expect(window.history.pushState).toHaveBeenCalledWith(
      null,
      "",
      "#getting-started"
    );
  });

  it("className prop이 제공되면 적용해야 함", () => {
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(
      <TableOfContents headings={mockHeadings} className="custom-toc-class" />
    );
    
    // 데스크톱 TOC nav 요소 찾기
    const navElements = screen.getAllByRole("navigation");
    const desktopNav = navElements.find(nav => 
      nav.className.includes("hidden lg:block")
    );
    
    expect(desktopNav).toHaveClass("custom-toc-class");
  });

  it("모바일 햄버거 버튼이 렌더링되어야 함", () => {
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    const hamburgerButton = screen.getByLabelText("목차 토글");
    expect(hamburgerButton).toBeInTheDocument();
  });

  it("모바일 메뉴 토글이 작동해야 함", async () => {
    const user = userEvent.setup();
    
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    const hamburgerButton = screen.getByLabelText("목차 토글");
    
    // 초기 상태: 메뉴 닫힘
    expect(hamburgerButton).toHaveAttribute("aria-expanded", "false");
    
    // 햄버거 버튼 클릭: 메뉴 열림
    await user.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute("aria-expanded", "true");
    
    // 다시 클릭: 메뉴 닫힘
    await user.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute("aria-expanded", "false");
  });

  it("모바일 메뉴가 열렸을 때 오버레이가 표시되어야 함", async () => {
    const user = userEvent.setup();
    
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    const hamburgerButton = screen.getByLabelText("목차 토글");
    
    // 메뉴 열기
    await user.click(hamburgerButton);
    
    // 오버레이 확인 (aria-hidden="true" 속성을 가진 div)
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass("fixed", "inset-0", "bg-black/30");
  });

  it("모바일 메뉴 제목이 표시되어야 함", async () => {
    const user = userEvent.setup();
    
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    const hamburgerButton = screen.getByLabelText("목차 토글");
    await user.click(hamburgerButton);
    
    const title = screen.getByText("목차");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H3");
  });

  it("IntersectionObserver가 모든 헤딩 요소를 관찰해야 함", () => {
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={mockHeadings} />);
    
    const observerInstance = (window.IntersectionObserver as any).mock.results[0].value;
    expect(observerInstance.observe).toHaveBeenCalledTimes(mockHeadings.length);
  });

  it("컴포넌트 언마운트 시 observer가 정리되어야 함", () => {
    // DOM 요소 생성
    mockHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    const { unmount } = render(<TableOfContents headings={mockHeadings} />);
    
    const observerInstance = (window.IntersectionObserver as any).mock.results[0].value;
    
    unmount();
    
    expect(observerInstance.unobserve).toHaveBeenCalledTimes(mockHeadings.length);
  });

  it("중복된 ID를 가진 헤딩들을 올바르게 처리해야 함", () => {
    const duplicateHeadings: Heading[] = [
      { id: "같은-제목", text: "같은 제목", level: 1 },
      { id: "같은-제목-1", text: "같은 제목", level: 2 },
      { id: "같은-제목-2", text: "같은 제목", level: 3 },
    ];
    
    // DOM 요소 생성
    duplicateHeadings.forEach((heading) => {
      const element = document.createElement("div");
      element.id = heading.id;
      document.body.appendChild(element);
    });
    
    render(<TableOfContents headings={duplicateHeadings} />);
    
    const links = screen.getAllByText("같은 제목");
    // 모바일과 데스크톱 버전이 각각 렌더링되므로 2배
    expect(links).toHaveLength(6);
    
    // 각 링크가 고유한 href를 가지는지 확인
    expect(links[0].closest("a")).toHaveAttribute("href", "#%EA%B0%99%EC%9D%80-%EC%A0%9C%EB%AA%A9");
    expect(links[1].closest("a")).toHaveAttribute("href", "#%EA%B0%99%EC%9D%80-%EC%A0%9C%EB%AA%A9-1");
    expect(links[2].closest("a")).toHaveAttribute("href", "#%EA%B0%99%EC%9D%80-%EC%A0%9C%EB%AA%A9-2");
  });
});