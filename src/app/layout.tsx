import type { Metadata } from "next";

import "98.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Next Blog",
  description: "A blog built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body
        style={{
          fontFamily:
            "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          maxWidth: "1080px",
          margin: "0 auto",
        }}
      >
        {children}
      </body>
    </html>
  );
}
