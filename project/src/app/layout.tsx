/**
 * 루트 레이아웃
 * 전체 앱의 기본 레이아웃 및 글로벌 프로바이더
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AILEX - AI 기본법 컴플라이언스 자동화 플랫폼",
  description:
    "한국 AI 기본법(2026.1.22 시행)에 따른 고영향 AI 판정, 의무 문서 자동 생성, 컴플라이언스 대시보드를 제공하는 AI 법률 전문 플랫폼",
  keywords: [
    "AI 기본법",
    "컴플라이언스",
    "고영향 AI",
    "영향평가서",
    "투명성",
    "AI 규제",
  ],
  openGraph: {
    title: "AILEX - AI 기본법 컴플라이언스 자동화",
    description:
      "고영향 AI 자가진단부터 의무 문서 생성까지, AI 기본법 대응을 자동화하세요",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          {children}
          <Toaster position="top-right" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
