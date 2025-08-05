"use client";

import { SCROLL_OFFSET } from "@/app/posts/[slug]/(components)/HeadingWithAnchor";
import { generateSlug } from "@/utils/generateSlug";
import { scrollToElement } from "@/utils/scrollToElement";
import { useEffect, useMemo, useState } from "react";

interface TableOfContentsProps {
  content: string;
  className?: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TocListProps {
  headings: Heading[];
  activeId: string;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

function TocList({ headings, activeId, onItemClick }: TocListProps) {
  const getLevelClass = (level: number) => {
    switch (level) {
      case 1:
      case 2:
        return "";
      case 3:
        return "pl-4";
      case 4:
        return "pl-8";
      case 5:
        return "pl-12";
      default:
        return "pl-16";
    }
  };

  return (
    <ul className="list-none m-0 lg:py-0 text-sm">
      {headings.map((heading) => (
        <li key={heading.id} className={`${getLevelClass(heading.level)}`}>
          <a
            href={`#${encodeURIComponent(heading.id)}`}
            onClick={(e) => onItemClick(e, heading.id)}
            className={`
              block py-1 lg:py-0.5 px-4 lg:px-3
              transition-all duration-200
              hover:text-blue-600 dark:hover:text-blue-400
              ${
                activeId === heading.id
                  ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 border-l-4 border-transparent"
              }
            `}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      className="lg:hidden fixed bottom-4 right-4 z-[1001] p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-all duration-300 hover:bg-white dark:hover:bg-gray-800"
      onClick={onClick}
      aria-label="목차 토글"
      aria-expanded={isOpen}
    >
      <div className="w-6 h-5 flex flex-col justify-between relative">
        <span
          className={`block h-[3px] w-full bg-gray-700 dark:bg-gray-300 rounded-sm transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-[8.5px]" : ""
          }`}
        />
        <span
          className={`block h-[3px] w-full bg-gray-700 dark:bg-gray-300 rounded-sm transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[3px] w-full bg-gray-700 dark:bg-gray-300 rounded-sm transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-[8.5px]" : ""
          }`}
        />
      </div>
    </button>
  );
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headings = useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];
    return matches.map((match) => {
      const level = match[1].length;
      const text = match[2];
      const id = generateSlug(text);

      return { id, text, level };
    });
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `-${SCROLL_OFFSET}px 0px -80% 0px` },
    );

    // 모든 요소를 한 번에 수집하여 처리
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToElement(id);
    // preventDefault 때문에 이 처리를 추가로 해 줘야 함
    window.history.pushState(null, "", `#${encodeURIComponent(id)}`);
    // 모바일에서 클릭 후 메뉴 닫기
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* 데스크톱 TOC */}
      <nav className={`hidden lg:block overflow-y-auto py-12 ${className}`}>
        <TocList
          headings={headings}
          activeId={activeId}
          onItemClick={handleClick}
        />
      </nav>

      {/* 모바일 햄버거 버튼 */}
      <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />

      {/* 모바일 TOC */}
      <nav
        className={`
          lg:hidden fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white dark:bg-gray-800
          shadow-2xl z-[1000] transition-transform duration-300 ease-in-out overflow-y-auto
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            목차
          </h3>
        </div>
        <TocList
          headings={headings}
          activeId={activeId}
          onItemClick={handleClick}
        />
      </nav>

      {/* 모바일 오버레이 */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[999]"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
