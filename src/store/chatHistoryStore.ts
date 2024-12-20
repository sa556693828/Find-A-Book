import { Message } from "@/types";
import { create } from "zustand";

interface ChatHistoryState {
  chatHistory: Message[] | null;
  isLoading: boolean;
  fetchChatHistory: (userId: string, personaId: string) => Promise<void>;
}

export const useChatHistoryStore = create<ChatHistoryState>((set) => ({
  chatHistory: null,
  isLoading: false,
  fetchChatHistory: async (userId: string, personaId: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch(
        `/api/chatHistory?userId=${userId}&personaId=${personaId}`
      );
      const data = await response.json();
      if (data.success) {
        set({ chatHistory: data.userHistories || [] });
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
