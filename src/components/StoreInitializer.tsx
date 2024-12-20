"use client";

import { useEffect } from "react";
import { usePersonaStore } from "@/store/usePersonaStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function StoreInitializer() {
  const fetchPersonas = usePersonaStore((state) => state.fetchPersonas);
  const getUserId = useAuthStore((state) => state.getUserId);
  useEffect(() => {
    fetchPersonas();
    getUserId();
  }, [fetchPersonas, getUserId]);

  return null;
}
