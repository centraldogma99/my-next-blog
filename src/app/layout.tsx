import type { Metadata } from "next";
import { pretendard } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dogma Blog",
  description: "Dogma 블로그",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head></head>
      <body className={`${pretendard.variable}`}>
        <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
          <div className="container flex items-center h-16">
            <h1 className="text-xl font-semibold">Dogma Blog</h1>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
