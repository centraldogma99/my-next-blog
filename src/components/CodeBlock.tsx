import type { BundledLanguage } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type JSX } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export async function CodeBlock({ children, className }: CodeBlockProps) {
  let language: BundledLanguage | "text" = "text";

  if (className?.startsWith("language-")) {
    const lang = className.replace("language-", "");
    language = lang as BundledLanguage;
  }

  try {
    const out = await codeToHast(children, {
      lang: language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });

    return toJsxRuntime(out, {
      Fragment,
      jsx,
      jsxs,
      components: {
        pre: (props) => (
          <pre
            {...props}
            className={`${props.className || ""} p-4 rounded-md`}
          />
        ),
      },
    }) as JSX.Element;
  } catch {
    return (
      <pre className={`${className || ""} p-4 rounded-md`}>{children}</pre>
    );
  }
}
