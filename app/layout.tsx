import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // 이 부분이 CSS를 가져옵니다.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "초텐 VAPE샵",
  description: "초텐 VAPE 신용샵",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* body에 className으로 스타일을 명확히 주어 CSS가 
         전체 페이지에 덮이도록 합니다. 
      */}
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans">
        {children}
      </body>
    </html>
  );
}