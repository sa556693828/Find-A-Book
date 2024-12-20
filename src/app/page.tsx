"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import QueryClient from "@/components/QueryClient";

const BookRecommendation = () => {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
    }
  }, [router]);

  return <QueryClient />;
};

export default BookRecommendation;
