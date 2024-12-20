"use client";
import ChatSection from "@/components/chating/ChatSection";
import BookList from "@/components/SummaryBooks/BookList";
import PersonaIntro from "@/components/SummaryBooks/PersonaIntro";
import { useChatHistoryStore } from "@/store/chatHistoryStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePersonaStore } from "@/store/usePersonaStore";
import { BookData, Message } from "@/types";
import React, { useCallback, useEffect, useState } from "react";

// const books_distincts = [
//   {
//     book_id: "11101013428",
//     book_title: "逆思維：華頓商學院最具影響力的教授，突破人生盲點的全局思考",
//     book_url: "https://media.taaze.tw/products/11101013428.html",
//     book_keywords: ["個人成長", "思維", "逆思維"],
//     content:
//       "從自己到他人，從他人到群體，從群體到社會。「逆思維」幫助我們用開放的心態，提升心智的彈性，建立良性的衝突，在瞬息萬變的世界中找到平衡點。真正的「知道」，就是承認自己的 ...",
//   },
// ];

const QueryClient = () => {
  const { userId } = useAuthStore();
  const { personaId } = usePersonaStore();
  const { chatHistory, fetchChatHistory } = useChatHistoryStore();
  const [summary] = useState("");
  const [summaryBooks, setSummaryBooks] = useState<BookData[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [chatHistoryNum, setChatHistoryNum] = useState(
    chatHistory && chatHistory.length ? chatHistory.length : 0
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChat, setCurrentChat] = useState<Message[] | null>([]);

  const handleSummary = useCallback(
    async (userId: string, personaId: string) => {
      setSummaryLoading(true);
      try {
        // setPrompts([]);
        // setBooksLinks([]);
        // setAiBooksLinks([]);
        const baseUrl = process.env.NEXT_PUBLIC_NGROK_URL;
        const response = await fetch(`${baseUrl}/summary_query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId, personaId: personaId }),
        });

        // 檢查響應狀態
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 檢查 response.body 是否為空
        if (!response.body) {
          throw new Error("Response body is null");
        }
        setChatHistoryNum(chatHistory?.length || 0);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        setSummaryLoading(false);
        try {
          setIsStreaming(true);
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim()) continue;

              // 檢查是否收到結束信號
              if (line.includes("[DONE]")) {
                return; // 直接返回，結束整個函數
              }

              try {
                const parsedData = JSON.parse(line);
                if (parsedData.summary) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];
                    // 如果最後一條消息是AI的回應，則更新其內容
                    if (lastMessage && lastMessage.role === "ai") {
                      const updatedChat = [...prev];
                      updatedChat[updatedChat.length - 1] = {
                        role: "ai",
                        content: lastMessage.content + parsedData.summary,
                        query_tag: "summary",
                      };
                      return updatedChat;
                    }
                    return [
                      ...(prev || []),
                      {
                        role: "ai",
                        content: parsedData.summary,
                        query_tag: "summary",
                      },
                    ];
                  });
                }
                if (parsedData.summary_book_list)
                  setSummaryBooks((prev) => {
                    return [...(prev || []), ...parsedData.summary_book_list];
                  });
              } catch (e) {
                console.warn("Failed to parse line:", e);
              }
            }
          }
          if (buffer.trim() && !buffer.includes("[DONE]")) {
            try {
              const parsedData = JSON.parse(buffer);
              if (parsedData.summary) {
                setCurrentChat((prev) => {
                  const lastMessage = prev?.[prev.length - 1];
                  // 如果最後一條消息是AI的回應，則更新其內容
                  if (lastMessage && lastMessage.role === "ai") {
                    const updatedChat = [...prev];
                    updatedChat[updatedChat.length - 1] = {
                      role: "ai",
                      content: lastMessage.content + parsedData.summary,
                      query_tag: "summary",
                    };
                    return updatedChat;
                  }
                  return [
                    ...(prev || []),
                    {
                      role: "ai",
                      content: parsedData.summary,
                      query_tag: "summary",
                    },
                  ];
                });
              }
              if (parsedData.summary_book_list)
                setSummaryBooks((prev) => {
                  return [...(prev || []), ...parsedData.summary_book_list];
                });
            } catch (e) {
              console.warn("Failed to parse final buffer:", e);
            }
          }
        } finally {
          reader.releaseLock();
          setIsStreaming(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Stream error:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        setIsStreaming(false);
        setSummaryLoading(false);
      }
    },
    []
  );
  const handleQuery = useCallback(
    async (userId: string, userQuery: string, personaId: string) => {
      setQueryLoading(true);
      try {
        setCurrentChat((prev) => [
          ...(prev || []),
          { role: "human", content: userQuery },
        ]);
        // setPrompts([]);
        const baseUrl = process.env.NEXT_PUBLIC_NGROK_URL;
        const response = await fetch(`${baseUrl}/query_search_chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            userQuery: userQuery,
            personaId: personaId,
          }),
        });

        // 檢查響應狀態
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 檢查 response.body 是否為空
        if (!response.body) {
          throw new Error("Response body is null");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        setQueryLoading(false);
        while (true) {
          setIsStreaming(true);
          const { value, done } = await reader.read();
          if (done) break;

          // 將新的chunk添加到buffer中
          buffer += decoder.decode(value, { stream: true });

          // 嘗試按行分割並解析
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // 保存最後一個不完整的行

          // 處理每一行數據
          for (const line of lines) {
            if (line.trim()) {
              // 忽略空行
              try {
                setIsStreaming(true);
                const parsedData = JSON.parse(line);
                if (parsedData.query_response) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];
                    if (lastMessage && lastMessage.role === "ai") {
                      const newContent = parsedData.query_response;
                      if (!lastMessage.content.endsWith(newContent)) {
                        const updatedChat = [...(prev || [])];
                        updatedChat[updatedChat.length - 1] = {
                          role: "ai",
                          content:
                            lastMessage.content +
                            newContent.slice(lastMessage.content.length),
                          query_tag: "query",
                        };
                        return updatedChat;
                      }
                      return prev;
                    } else {
                      return [
                        ...(prev || []),
                        {
                          role: "ai",
                          content: parsedData.query_response,
                          query_tag: "query",
                        },
                      ];
                    }
                  });
                }
                if (parsedData.query_book_list) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];

                    // 如果没有之前的消息，直接创建新消息
                    if (!prev?.length) {
                      return [
                        {
                          role: "ai",
                          content: "", // 添加必需的 content 字段
                          book_list: parsedData.query_book_list,
                          query_tag: "query",
                        },
                      ];
                    }

                    // 如果最后一条是 AI 消息，更新它的 book_list
                    if (lastMessage?.role === "ai") {
                      // 检查是否有重复的书籍
                      const newBooks = parsedData.query_book_list.filter(
                        (book: BookData) =>
                          !lastMessage.book_list?.includes(book)
                      );

                      if (newBooks.length === 0) return prev;

                      const updatedChat = [...prev];
                      updatedChat[updatedChat.length - 1] = {
                        ...lastMessage,
                        book_list: [
                          ...(lastMessage.book_list || []),
                          ...newBooks,
                        ],
                      };
                      return updatedChat;
                    }

                    // 如果最后一条不是 AI 消息，添加新的 AI 消息
                    return [
                      ...prev,
                      {
                        role: "ai",
                        content: "", // 添加必需的 content 字段
                        book_list: parsedData.query_book_list,
                        query_tag: "query",
                      },
                    ];
                  });
                }
                if (parsedData.query_result) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];
                    if (lastMessage && lastMessage.role === "ai") {
                      const updatedChat = [...prev];
                      updatedChat[updatedChat.length - 1] = {
                        ...lastMessage,
                        content: lastMessage.content + parsedData.query_result,
                        book_list: lastMessage.book_list,
                        query_tag: "query",
                      };
                      return updatedChat;
                    }
                    return [
                      ...(prev || []),
                      {
                        role: "ai",
                        content: parsedData.query_result,
                        book_list: lastMessage?.book_list || [],
                        query_tag: "query",
                      },
                    ];
                  });
                }
              } catch (e) {
                console.warn("Failed to parse line:", e);
              }
            }
          }
        }

        // 處理最後剩餘的buffer
        if (buffer.trim()) {
          try {
            const parsedData = JSON.parse(buffer);
            if (parsedData.query_response) {
              setCurrentChat((prev) => {
                const lastMessage = prev?.[prev.length - 1];
                if (lastMessage && lastMessage.role === "ai") {
                  const newContent = parsedData.query_response;
                  if (!lastMessage.content.endsWith(newContent)) {
                    const updatedChat = [...(prev || [])];
                    updatedChat[updatedChat.length - 1] = {
                      role: "ai",
                      content:
                        lastMessage.content +
                        newContent.slice(lastMessage.content.length),
                      query_tag: "query",
                    };
                    return updatedChat;
                  }
                  return prev;
                } else {
                  return [
                    ...(prev || []),
                    {
                      role: "ai",
                      content: parsedData.query_response,
                      query_tag: "query",
                    },
                  ];
                }
              });
            }
            if (parsedData.query_book_list) {
              setCurrentChat((prev) => {
                const lastMessage = prev?.[prev.length - 1];

                // 如果没有之前的消息，直接创建新消息
                if (!prev?.length) {
                  return [
                    {
                      role: "ai",
                      content: "", // 添加必需的 content 字段
                      book_list: parsedData.query_book_list,
                      query_tag: "query",
                    },
                  ];
                }

                // 如果最后一条是 AI 消息，更新它的 book_list
                if (lastMessage?.role === "ai") {
                  // 检查是否有重复的书籍
                  const newBooks = parsedData.query_book_list.filter(
                    (book: BookData) => !lastMessage.book_list?.includes(book)
                  );

                  if (newBooks.length === 0) return prev;

                  const updatedChat = [...prev];
                  updatedChat[updatedChat.length - 1] = {
                    ...lastMessage,
                    book_list: [...(lastMessage.book_list || []), ...newBooks],
                  };
                  return updatedChat;
                }

                // 如果最后一条不是 AI 消息，添加新的 AI 消息
                return [
                  ...prev,
                  {
                    role: "ai",
                    content: "", // 添加必需的 content 字段
                    book_list: parsedData.query_book_list,
                    query_tag: "query",
                  },
                ];
              });
            }
            if (parsedData.query_result) {
              setCurrentChat((prev) => {
                const lastMessage = prev?.[prev.length - 1];
                if (lastMessage && lastMessage.role === "ai") {
                  const updatedChat = [...prev];
                  updatedChat[updatedChat.length - 1] = {
                    ...lastMessage,
                    content: lastMessage.content + parsedData.query_result,
                    book_list: [],
                    query_tag: "query",
                  };
                  return updatedChat;
                }
                return [
                  ...(prev || []),
                  {
                    role: "ai",
                    content: parsedData.query_result,
                    book_list: [],
                    query_tag: "query",
                  },
                ];
              });
            }
          } catch (e: unknown) {
            if (e instanceof Error) {
              console.warn("Failed to parse final buffer:", e.message);
            } else {
              console.warn("Failed to parse final buffer:", e);
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Stream error:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  useEffect(() => {
    if (userId && personaId) {
      setCurrentChat(null);
      fetchChatHistory(userId, personaId);
    }
  }, [userId, personaId]);

  useEffect(() => {
    if (!isStreaming) {
      if (
        currentChat &&
        currentChat.length >= 6 &&
        chatHistoryNum !== currentChat.length
      ) {
        handleSummary(userId, personaId);
      }
    }
  }, [currentChat, isStreaming, chatHistoryNum]);

  return (
    <div
      className="flex justify-start w-full gap-2 pb-2 px-2 bg-[#e8e8e8]"
      style={{
        height: "calc(100vh - 52px)",
      }}
    >
      <ChatSection
        currentChat={currentChat || []}
        chatHistory={chatHistory || []}
        isStreaming={isStreaming}
        isLoading={summaryLoading || queryLoading}
        handleQuery={handleQuery}
      />
      <div className="w-1/2 mx-auto relative rounded-lg flex flex-col bg-black h-[calc(100vh-60px)]">
        <PersonaIntro />
        <div className="w-full mx-auto p-4">
          <div className="h-[1px] w-full bg-white/30" />
        </div>
        <BookList
          isStreaming={isStreaming}
          summary={summary || ""}
          chatHistory={chatHistory || []}
          books={summaryBooks || []}
        />
      </div>
    </div>
  );
};

export default QueryClient;
