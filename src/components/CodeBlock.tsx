import type { BundledLanguage } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type JSX } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast, bundledLanguages } from "shiki";

interface CodeBlockProps {
  children: string;
  className?: string;
  language: BundledLanguage;
}

export const isSupportedLanguage = (
  language: string,
): language is BundledLanguage => {
  return language in bundledLanguages;
};

export async function CodeBlock({ children, language }: CodeBlockProps) {
  try {
    const out = await codeToHast(children, {
      lang: language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });
    return toJsxRuntime(out, {
      Fragment,
      jsx,
      jsxs,
    }) as JSX.Element;
  } catch {
    return <code>{children}</code>;
  }
}
