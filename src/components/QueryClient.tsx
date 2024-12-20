"use client";
import ChatSection from "@/components/chating/ChatSection";
import BookList from "@/components/SummaryBooks/BookList";
import PersonaIntro from "@/components/SummaryBooks/PersonaIntro";
import { useChatHistoryStore } from "@/store/chatHistoryStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePersonaStore } from "@/store/usePersonaStore";
import { BookData, Message } from "@/types";
import React, { useCallback, useEffect, useState } from "react";

const QueryClient = () => {
  const { userId } = useAuthStore();
  const { personaId } = usePersonaStore();
  const { chatHistory, fetchChatHistory } = useChatHistoryStore();
  const [chatHistoryNum, setChatHistoryNum] = useState(0);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChat, setCurrentChat] = useState<Message[]>([]);

  const handleSummary = useCallback(
    async (userId: string, personaId: string) => {
      setSummaryLoading(true);
      try {
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
                    if (
                      lastMessage &&
                      lastMessage.role === "ai" &&
                      lastMessage.query_tag === "summary"
                    ) {
                      const updatedChat = [...prev];
                      const newContent = parsedData.summary;
                      if (!lastMessage.content.endsWith(newContent)) {
                        updatedChat[updatedChat.length - 1] = {
                          ...lastMessage,
                          content:
                            lastMessage.content +
                            newContent.slice(lastMessage.content.length),
                          book_list: lastMessage.book_list,
                          query_tag: "summary",
                        };
                      }
                      return updatedChat;
                    }
                    return [
                      ...(prev || []),
                      {
                        role: "ai",
                        content: parsedData.summary,
                        book_list: lastMessage?.book_list || [],
                        query_tag: "summary",
                      },
                    ];
                  });
                }
                if (parsedData.summary_books) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];

                    // 如果没有之前的消息，直接创建新消息
                    if (!prev?.length) {
                      return [
                        {
                          role: "ai",
                          content: "",
                          book_list: parsedData.summary_books,
                          query_tag: "summary",
                        },
                      ];
                    }

                    // 如果最后一条是 AI 消息，更新它的 book_list
                    if (
                      lastMessage?.role === "ai" &&
                      lastMessage.query_tag === "summary"
                    ) {
                      // 检查是否有重复的书籍
                      const newBooks = parsedData.summary_books.filter(
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

                    // 如果最后一条不是 AI 且不是 summary，添加新的 AI 消息
                    return [
                      ...prev,
                      {
                        role: "ai",
                        content: "",
                        book_list: parsedData.summary_books,
                        query_tag: "summary",
                      },
                    ];
                  });
                }
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
                  if (
                    lastMessage &&
                    lastMessage.role === "ai" &&
                    lastMessage.query_tag === "summary"
                  ) {
                    const updatedChat = [...prev];
                    const newContent = parsedData.summary;
                    if (!lastMessage.content.endsWith(newContent)) {
                      updatedChat[updatedChat.length - 1] = {
                        ...lastMessage,
                        content:
                          lastMessage.content +
                          newContent.slice(lastMessage.content.length),
                        book_list: lastMessage.book_list,
                        query_tag: "summary",
                      };
                    }
                    return updatedChat;
                  }
                  return [
                    ...(prev || []),
                    {
                      role: "ai",
                      content: parsedData.summary,
                      book_list: lastMessage?.book_list || [],
                      query_tag: "summary",
                    },
                  ];
                });
              }
              if (parsedData.summary_books) {
                setCurrentChat((prev) => {
                  const lastMessage = prev?.[prev.length - 1];

                  // 如果没有之前的消息，直接创建新消息
                  if (!prev?.length) {
                    return [
                      {
                        role: "ai",
                        content: "",
                        book_list: parsedData.summary_books,
                        query_tag: "summary",
                      },
                    ];
                  }

                  // 如果最后一条是 AI 消息，更新它的 book_list
                  if (lastMessage?.role === "ai") {
                    // 检查是否有重复的书籍
                    const newBooks = parsedData.summary_books.filter(
                      (book: BookData) => !lastMessage.book_list?.includes(book)
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

                  // 如果最后一条不是 AI 消息 且不是 summary，添加新的 AI 消息
                  return [
                    ...prev,
                    {
                      role: "ai",
                      content: "",
                      book_list: parsedData.summary_books,
                      query_tag: "summary",
                    },
                  ];
                });
              }
            } catch (e) {
              console.warn("Failed to parse final buffer:", e);
            }
          }
        } finally {
          reader.releaseLock();
          setChatHistoryNum((prev) => prev + 1);
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
          { role: "human", content: userQuery, query_tag: "query" },
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
        setChatHistoryNum((prev) => prev + 1);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        // setQueryLoading(false);
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
        setQueryLoading(false);
        setIsStreaming(false);
      }
    },
    []
  );

  useEffect(() => {
    if (userId && personaId) {
      setCurrentChat([]);
      fetchChatHistory(userId, personaId);
    }
  }, [userId, personaId]);
  useEffect(() => {
    if (!isStreaming && !queryLoading) {
      if (
        currentChat &&
        chatHistory &&
        currentChat.length + chatHistory.length > 6 &&
        chatHistoryNum !==
          currentChat.filter((msg) => msg.query_tag === "query").length
      ) {
        handleSummary(userId, personaId);
      }
    }
  }, [currentChat, isStreaming, chatHistory, chatHistoryNum]);

  return (
    <div
      className="flex justify-start w-full gap-2 pb-2 px-2 bg-[#e8e8e8]"
      style={{
        height: "calc(100vh - 52px)",
      }}
    >
      <ChatSection
        currentChat={currentChat.filter(
          (message) => message.query_tag === "query"
        )}
        chatHistory={
          chatHistory?.filter((message) => message.query_tag === "query") || []
        }
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
          chatHistory={
            chatHistory?.filter((message) => message.query_tag === "summary") ||
            []
          }
          currentChat={currentChat.filter(
            (message) => message.query_tag === "summary"
          )}
        />
      </div>
    </div>
  );
};

export default QueryClient;
