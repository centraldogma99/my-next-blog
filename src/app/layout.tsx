import type { Metadata } from "next";
import { pretendard } from "./fonts";

import "./globals.css";
import "98.css";

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
      <head></head>
      <body className={`${pretendard.variable} max-w-screen-md mx-auto m-0 bg-[#c0c0c0]`}>
        {children}
      </body>
    </html>
  );
}
