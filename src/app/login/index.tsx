/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

const Login = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIds, setUserIds] = useState<string[]>([]);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUserIds = async () => {
    try {
      const response = await fetch("/api/users?getAllUserIds=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || data.details || "獲取用戶ID失敗");
      }

      setUserIds(data.users);
    } catch (error) {
      console.error("獲取用戶ID錯誤:", error);
    }
  };

  useEffect(() => {
    fetchUserIds();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserListOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserSelect = (selectedId: string) => {
    setUserId(selectedId);
    setIsUserListOpen(false);
  };
  const filteredUserIds = userIds.filter((id) =>
    id.toLowerCase().includes(userId.toLowerCase())
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(userId, password);
    if (result) {
      router.push("/");
    }
  };
  return (
    <div
      className="flex justify-center items-center w-full"
      style={{
        height: "calc(100vh - 52px)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white px-4 py-8 flex flex-col gap-8 items-center rounded-lg w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-black">會員登入</h1>
        <div className="w-full flex flex-col gap-2">
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              value={userId}
              placeholder="請輸入或選擇用戶 ID"
              className="w-full h-10 px-4 items-center text-sm flex bg-[#D7D7D7] rounded-md focus:outline-none"
              onChange={(e) => setUserId(e.target.value)}
              onClick={() => setIsUserListOpen(true)}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsUserListOpen(!isUserListOpen);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#FFFFFF]/60"
            >
              ▼
            </button>
            {isUserListOpen && (
              <div className="absolute text-black z-10 max-w-xs top-11 -left-4 bg-white border border-[#E8DFC9] rounded-md shadow-lg">
                <div className="max-h-60 overflow-y-auto">
                  {filteredUserIds.map((id, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserSelect(id);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#F8F3E6] focus:bg-[#F8F3E6] focus:outline-none"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密碼"
            className="w-full h-10 px-4 items-center text-sm flex bg-[#D7D7D7] rounded-md focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full font-bold py-4 mt-2 text-white text-base bg-black rounded-md hover:bg-black/80 focus:outline-none"
          >
            {isLoading ? "登入中..." : "會員登入"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
