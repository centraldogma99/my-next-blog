"use client";

import { SCROLL_OFFSET } from "@/components/HeadingWithAnchor";
import { generateSlug } from "@/utils/generateSlug";
import { scrollToElement } from "@/utils/scrollToElement";
import { useEffect, useMemo, useState } from "react";
import styles from "./TableOfContents.module.css";

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

function TocList({ headings, activeId, onItemClick }: TocListProps) {
  return (
    <ul className={styles.tocList}>
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={`${styles.tocItem} ${styles[`level${heading.level}`]}`}
        >
          <a
            href={`#${encodeURIComponent(heading.id)}`}
            onClick={(e) => onItemClick(e, heading.id)}
            className={`${styles.tocLink} ${
              activeId === heading.id ? styles.active : ""
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
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

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
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
      <nav className={`${styles.desktopToc} ${className}`}>
        <TocList
          headings={headings}
          activeId={activeId}
          onItemClick={handleClick}
        />
      </nav>

      {/* 모바일 햄버거 버튼 */}
      <button
        className={styles.hamburgerButton}
        onClick={toggleMenu}
        aria-label="목차 토글"
        aria-expanded={isMenuOpen}
      >
        <div
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ""}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* 모바일 TOC 네비게이션 */}
      <nav className={`${styles.mobileToc} ${isMenuOpen ? styles.active : ""}`}>
        <div className={styles.tocHeader}>
          <h3 className={styles.tocTitle}>목차</h3>
          <button
            className={styles.closeButton}
            onClick={() => setIsMenuOpen(false)}
            aria-label="목차 닫기"
          >
            <CloseButtonSVG />
          </button>
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
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

const CloseButtonSVG = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
