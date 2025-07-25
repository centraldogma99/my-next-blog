import type { Metadata } from "next";
import { pretendard } from "./fonts";
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";

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
        <ThemeProvider>
          <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
            <div className="container flex items-center justify-between h-16">
              <h1 className="text-xl font-semibold">
                <Link
                  href="/"
                  className="text-[var(--color-text)] hover:text-[var(--color-text)] no-underline hover:underline-0 cursor-pointer"
                >
                  Dogma Blog
                </Link>
              </h1>
              <ThemeToggle />
            </div>
          </header>
          <main className="container py-6">{children}</main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
