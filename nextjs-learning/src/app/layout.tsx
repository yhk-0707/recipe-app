import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recipe App",
  description: "Next.js で作るレシピ検索・登録アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-slate-900">
        {children}
      </body>
    </html>
  );
}
