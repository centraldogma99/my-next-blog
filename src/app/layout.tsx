import type { Metadata } from "next";
import { pretendard } from "./fonts";
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DEFAULT_THEME } from "@/constants/theme";
import { DOMAIN } from "@/constants/domain";
import { SITE_NAME, AUTHOR_NAME, SITE_DESCRIPTION, SITE_KEYWORDS } from "@/constants/site";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: DOMAIN,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "zIXlP_nEMHeMayTwzohtA8sPvi8XQtA4Z2JW77bH42U", // Google Search Console에서 받은 인증 코드
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={DEFAULT_THEME}>
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
                  {SITE_NAME}
                </Link>
              </h1>
              <ThemeToggle />
            </div>
          </header>
          <main className="container">{children}</main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
