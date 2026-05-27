import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "数字孪生座椅产线看板",
  description: "数字化座椅产线实时监控看板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
