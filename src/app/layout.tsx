import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "魔方纹韵 - 智能魔方与中国传统纹样创作平台",
  description: "使用GAN智能魔方控制中国传统纹样元素，创作独特的艺术图案，AI生成创意设计作品",
  keywords: ["智能魔方", "GAN魔方", "中国传统纹样", "回纹", "云纹", "AI设计", "创意生成"],
  authors: [{ name: "魔方纹韵团队" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
