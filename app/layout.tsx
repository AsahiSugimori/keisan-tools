import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://keisan-tools-zeta.vercel.app"),
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  title: {
    default: "ヨサンメモ",
    template: "%s",
  },
  description:
    "時給計算、年収計算、残業代計算など仕事や生活に役立つ計算ツールを無料で利用できます。",
  verification: {
    google: "iyfgbgeSNY-fbd6FvVklVswnhOZyC0xG-ot9I-naMZ8",
  },
  openGraph: {
    title: "ヨサンメモ",
    description:
      "時給計算、年収計算、残業代計算など仕事や生活に役立つ計算ツールを無料で利用できます。",
    siteName: "ヨサンメモ",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "ヨサンメモのOGP画像",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta
          name="google-site-verification"
          content="iyfgbgeSNY-fbd6FvVklVswnhOZyC0xG-ot9I-naMZ8"
        />
      </head>
      <body>
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <a href="/" className="text-xl font-bold hover:text-blue-600">
              ヨサンメモ
            </a>
          </div>
        </header>

        {children}
        <Analytics />

        <footer className="mt-10 border-t bg-gray-50 px-4 py-6 text-sm text-gray-500">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-3">
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-blue-600">
                プライバシーポリシー
              </a>
              <a href="/disclaimer" className="hover:text-blue-600">
                免責事項
              </a>
              <a href="/contact" className="hover:text-blue-600">
                お問い合わせ
              </a>
            </div>
            <p>© 2026 ヨサンメモ</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
