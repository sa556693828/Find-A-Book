"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="h-[60px] px-8 border-b flex justify-between items-center bg-white/80 backdrop-blur">
      {/* 左側Logo */}
      <Link href="/" className="flex items-center">
        <Image src="/tazzeLogo.png" alt="logo" width={150} height={40} />
      </Link>

      {/* 中間導航菜單 */}
      <nav className="flex items-center gap-8">
        <Link href="/classroom" className="text-gray-700 hover:text-pink">
          學堂
        </Link>
        <Link href="/books" className="text-gray-700 hover:text-pink">
          冊格子
        </Link>
        <Link href="/secondhand" className="text-gray-700 hover:text-pink">
          二手書送你
        </Link>
      </nav>

      {/* 右側用戶操作區 */}
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-gray-700 hover:text-pink">
          登入
        </Link>
        <Link
          href="/register"
          className="px-4 py-1 rounded-full bg-pink-500 text-pink hover:bg-pink-600"
        >
          註冊
        </Link>
        <Link href="/member" className="text-gray-700 hover:text-pink">
          會員中心
        </Link>
        <Link
          href="/cart"
          className="flex items-center gap-1 text-gray-700 hover:text-pink"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>1</span>
        </Link>
      </div>
    </header>
  );
}
