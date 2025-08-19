import type { Metadata } from "next";
import { pretendard } from "./fonts";
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DEFAULT_THEME } from "@/constants/theme";
import { DOMAIN } from "@/constants/domain";
import {
  SITE_NAME,
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/constants/site";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthProvider from "@/components/AuthProvider";
import AuthButton from "@/components/AuthButton";
import NewPostButton from "@/components/NewPostButton";

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
    google: "tM0bQCuem6ovQoUH1IFXs0ctwphtKyqD_5BN28ahlaY", // Google Search Console에서 받은 인증 코드
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
        <AuthProvider>
          <ThemeProvider>
            <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center justify-between h-16 px-8 fixed top-0 left-0 right-0 z-50">
              <h1 className="text-xl font-semibold">
                <Link
                  href="/"
                  className="text-[var(--color-text)] hover:text-[var(--color-text)] no-underline hover:underline-0 cursor-pointer"
                >
                  {SITE_NAME}
                </Link>
              </h1>
              <div className="flex items-center gap-2">
                <NewPostButton />
                <AuthButton />
                <ThemeToggle />
              </div>
            </header>
            <main className="pt-16">{children}</main>
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
