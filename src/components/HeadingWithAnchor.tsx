"use client";

import { generateSlug } from "@/utils/generateSlug";
import { scrollToElement } from "@/utils/scrollToElement";
import React, { type ReactNode } from "react";

interface HeadingWithAnchorProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
}

// 헤더(64px) + main 패딩(48px) + 24px
export const SCROLL_OFFSET = 112;

/**
 * 부모 요소를 자신의 위치로 스크롤 이동. (element.parentElement로 참조)
 */
export function HeadingWithAnchor({
  level,
  children,
  className,
}: HeadingWithAnchorProps) {
  const text = String(children);
  const id = generateSlug(text);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      scrollToElement(id);

      window.history.pushState(null, "", `#${encodeURIComponent(id)}`);
    }
  };

  const headingProps = {
    id,
    className: `group ${className || ""}`,
    children: (
      <a
        href={`#${encodeURIComponent(id)}`}
        onClick={handleClick}
        className="no-underline hover:underline text-inherit"
        aria-label={`${text} 섹션으로 이동`}
      >
        {children}
      </a>
    ),
  };

  switch (level) {
    case 1:
      return <h1 {...headingProps} />;
    case 2:
      return <h2 {...headingProps} />;
    case 3:
      return <h3 {...headingProps} />;
    case 4:
      return <h4 {...headingProps} />;
    case 5:
      return <h5 {...headingProps} />;
    case 6:
      return <h6 {...headingProps} />;
    default:
      return <h2 {...headingProps} />;
  }
}
