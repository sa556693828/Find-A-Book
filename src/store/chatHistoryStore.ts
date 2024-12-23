import { Message, UserHistory } from "@/types";
import { create } from "zustand";

interface ChatHistoryState {
  allChatHistories: UserHistory[] | null;
  chatHistory: Message[] | null;
  isLoading: boolean;
  fetchAllChatHistory: (userId: string, personaId: string) => Promise<void>;
  fetchChatHistory: (
    userId: string,
    personaId: string
    // sessionId: string
  ) => Promise<void>;
  deleteChatHistory: (userId: string, personaId: string) => Promise<void>;
}

export const useChatHistoryStore = create<ChatHistoryState>((set) => ({
  allChatHistories: null,
  chatHistory: null,
  isLoading: false,
  fetchAllChatHistory: async (userId: string, personaId: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch(
        `/api/chatHistory?userId=${userId}&personaId=${personaId}`
      );
      const data = await response.json();
      if (data.success) {
        set({ allChatHistories: data.userHistories || [] });
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchChatHistory: async (
    userId: string,
    personaId: string
    // sessionId: string
  ) => {
    try {
      set({ isLoading: true });
      const response = await fetch(
        `/api/chatHistory?userId=${userId}&personaId=${personaId}`
        // `/api/chatHistory?userId=${userId}&personaId=${personaId}&sessionId=${sessionId}`
      );
      const data = await response.json();
      if (data.success) {
        set({ chatHistory: data.userMessages || [] });
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteChatHistory: async (userId: string, personaId: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch(
        `/api/chatHistory?userId=${userId}&personaId=${personaId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        set({ chatHistory: [] });
      }
    } catch (error) {
      console.error("Error deleting chat history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
