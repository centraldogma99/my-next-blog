"use client";

import { SCROLL_OFFSET } from "@/components/HeadingWithAnchor";
import { generateSlug } from "@/utils/generateSlug";
import { scrollToElement } from "@/utils/scrollToElement";
import { useEffect, useMemo, useState } from "react";

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

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
  };

  if (headings.length === 0) return null;

  return (
    <nav className={`overflow-y-auto ${className}`}>
      <ul className="text-sm list-none m-0">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={
              heading.level === 1
                ? ""
                : heading.level === 2
                  ? ""
                  : heading.level === 3
                    ? "pl-4"
                    : heading.level === 4
                      ? "pl-8"
                      : heading.level === 5
                        ? "pl-12"
                        : "pl-26"
            }
          >
            <a
              href={`#${encodeURIComponent(heading.id)}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block py-1 hover:text-blue-600 transition-colors ${
                activeId === heading.id
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
