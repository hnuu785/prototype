import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리집 그린체크 | AI 사전점검",
  description: "불편함에서 시작하는 우리 집 그린리모델링 사전점검 체험",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
