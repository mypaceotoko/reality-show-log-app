import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "恋愛リアリティショー視聴ログ",
  description: "恋愛リアリティショーの視聴記録を管理するアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-pink-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
            <span className="text-2xl">💕</span>
            <Link href="/" className="text-lg font-bold text-pink-600 hover:text-pink-700">
              恋リアログ
            </Link>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
