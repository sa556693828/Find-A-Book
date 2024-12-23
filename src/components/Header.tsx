"use client";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <header className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-[52px]">
          {/* Logo/網站名稱 */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-black text-base font-medium">
              /Find-A-Book
            </Link>
          </div>

          {/* 導航選項 */}
          <nav className="flex space-x-4 relative">
            {!isLoginPage && (
              <div>
                <FaUserCircle
                  className="text-black text-xl cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      登出
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
