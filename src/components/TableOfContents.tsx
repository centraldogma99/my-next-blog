"use client";

import { generateSlug } from "@/utils/generateSlug";
import { scrollToElement } from "@/utils/scrollToElement";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];

    const tocItems = matches.map((match) => {
      const level = match[1].length;
      const text = match[2];
      const id = generateSlug(text);

      return { id, text, level };
    });

    setHeadings(tocItems);
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
      { rootMargin: "-80px 0px -80% 0px" },
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
    window.history.pushState(null, "", `#${id}`);
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
              href={`#${heading.id}`}
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
