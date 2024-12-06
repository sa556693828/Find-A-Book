"use client";
import ChatComponent from "@/components/Chat";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { IoSearchSharp } from "react-icons/io5";
import SearchResultsSection from "@/components/SearchResult";

export interface UserHistory {
  role: string;
  content: string;
}
export interface BooksLinks {
  title: string;
  link: string;
  image: string;
}
export interface AiBooksLinks {
  title: string;
  link: string;
  content: string;
}

// TODO: 持續對話會持續改變結果
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<UserHistory[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [summary, setSummary] = useState("");
  const [, setKeywords] = useState([]);
  const [booksLinks, setBooksLinks] = useState<BooksLinks[]>([]);
  const [aiBooksLinks, setAiBooksLinks] = useState<AiBooksLinks[]>([]);
  const [, setIsSummary] = useState(false);
  const [chatHistoryNum, setChatHistoryNum] = useState(0);
  const [, setRetriggerSummary] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };
  const basicPrompt = [
    "幫我總結這本書的內容",
    "告訴我為什麼要讀這本書",
    "書中都用了哪些例子證明",
    "幫我用一段話總結書中想傳達的核心觀點",
    "我是一個上班族，我該用什麼角度去理解書中的內容",
  ];
  useEffect(() => {
    if (!isStreaming) {
      if (currentChat.length >= 6 && chatHistoryNum !== currentChat.length) {
        handleSummary(currentChat);
      }
    }
  }, [currentChat, isStreaming, chatHistoryNum]);
  // const handleClearChat = () => {
  //   setCurrentChat([]);
  // }; recommandation 先試、DocAgent推版、spec 推版、大語言訓練小語言、代碼規範、產品化要注意什麼

  const handleSummary = useCallback(async (chatHistory: UserHistory[]) => {
    setLoading(true);
    try {
      setPrompts([]);
      setSummary("");
      setKeywords([]);
      setBooksLinks([]);
      setAiBooksLinks([]);
      const env = process.env.NODE_ENV;
      const baseUrl =
        env === "development"
          ? "http://127.0.0.1:9000"
          : process.env.NEXT_PUBLIC_NGROK_URL;
      const response = await fetch(
        `${baseUrl}/summary_query?chat_history=${JSON.stringify(chatHistory)}`
      );

      // 檢查響應狀態
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 檢查 response.body 是否為空
      if (!response.body) {
        throw new Error("Response body is null");
      }
      setIsStreaming(true);
      setChatHistoryNum(chatHistory.length);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      setLoading(false);
      try {
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
              if (parsedData.summary) setSummary(parsedData.summary);
              if (parsedData.keywords) setKeywords(parsedData.keywords);
              if (parsedData.books) setBooksLinks(parsedData.books);
              if (parsedData.books_ai) setAiBooksLinks(parsedData.books_ai);
            } catch (e) {
              console.warn("Failed to parse line:", e);
            }
          }
        }
        if (buffer.trim() && !buffer.includes("[DONE]")) {
          try {
            const parsedData = JSON.parse(buffer);
            if (parsedData.summary) setSummary(parsedData.summary);
            if (parsedData.keywords) setKeywords(parsedData.keywords);
            if (parsedData.books) setBooksLinks(parsedData.books);
            if (parsedData.books_ai) setAiBooksLinks(parsedData.books_ai);
          } catch (e) {
            console.warn("Failed to parse final buffer:", e);
          }
        }
      } finally {
        reader.releaseLock();
        setIsSummary(true);
        setRetriggerSummary(false);
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
  }, []);
  const handleStream = useCallback(
    async (message: string, chatHistory: UserHistory[]) => {
      setLoading(true);
      try {
        setCurrentChat((prev) => [
          ...prev,
          { role: "human", content: message },
        ]);
        setPrompts([]);
        const env = process.env.NODE_ENV;
        const baseUrl =
          env === "development"
            ? "http://127.0.0.1:9000"
            : process.env.NEXT_PUBLIC_NGROK_URL;
        const response = await fetch(
          `${baseUrl}/query_search_chat?message=${message}&chat_history=${JSON.stringify(
            chatHistory
          )}`
        );

        // 檢查響應狀態
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 檢查 response.body 是否為空
        if (!response.body) {
          throw new Error("Response body is null");
        }
        setIsStreaming(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        setLoading(false);
        while (true) {
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
                const parsedData = JSON.parse(line);
                if (parsedData.content) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev[prev.length - 1];

                    // 如果最後一條消息是AI的回應，則更新其內容
                    if (lastMessage && lastMessage.role === "ai") {
                      const updatedChat = [...prev];
                      updatedChat[updatedChat.length - 1] = {
                        role: "ai",
                        content: lastMessage.content + parsedData.content,
                      };
                      return updatedChat;
                    }

                    return [
                      ...prev,
                      {
                        role: "ai",
                        content: parsedData.content,
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
            if (parsedData.content) {
              setCurrentChat((prev) => {
                const lastMessage = prev[prev.length - 1];

                // 如果最後一條消息是AI的回應，則更新其內容
                if (lastMessage && lastMessage.role === "ai") {
                  const updatedChat = [...prev];
                  updatedChat[updatedChat.length - 1] = {
                    role: "ai",
                    content: lastMessage.content + parsedData.content,
                  };
                  return updatedChat;
                }

                return [
                  ...prev,
                  {
                    role: "ai",
                    content: parsedData.content,
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputValue("");
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await handleStream(inputValue, currentChat);
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (isComposing) {
        return;
      }

      if (e.shiftKey) {
        return;
      } else if (!isSubmitting) {
        e.preventDefault();
        const currentInput = inputValue.trim();
        setInputValue("");
        if (currentInput) {
          await handleSubmit(e);
        }
      }
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };
  return (
    <div
      className="flex justify-center w-full gap-2 my-2"
      style={{
        minHeight: "calc(100vh - 60px)",
      }}
    >
      <div className="p-4 h-[92vh] border-r rounded-lg relative ml-2 w-1/2 mx-auto backdrop-blur-sm shadow-md flex flex-col border border-black/20">
        {/* 聊天訊息區域 */}
        {currentChat.length > 0 ? (
          <div className="flex-1 overflow-y-auto mb-4">
            <ChatComponent
              loading={loading}
              chatLog={currentChat}
              prompts={prompts}
              handleQuery={handleStream}
              basicPrompt={basicPrompt}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4">
            <h2 className="text-lg font-semibold text-pink/50 mb-2 flex items-center">
              跟 ツンデレツンツンツンデレ ちゃん 智能體聊聊吧...
            </h2>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 absolute bottom-4 w-4/5 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-start w-full bg-[#202123] rounded-xl shadow-sm border border-gray-800/50">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                adjustHeight();
              }}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onKeyDown={handleKeyDown}
              placeholder="輸入訊息... (Enter 發送, Shift + Enter 換行)"
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none resize-none min-h-[48px] max-h-[200px] overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#4B5563 transparent",
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`px-4 py-3 transition-colors self-end
              ${
                inputValue.trim()
                  ? "text-white hover:text-gray-300 cursor-pointer"
                  : "text-gray-600 cursor-not-allowed"
              }`}
              title={!inputValue.trim() ? "請輸入訊息" : "發送訊息"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
      <div className="flex-1 h-[92vh] gap-2 flex flex-col mr-2">
        <div className="p-5 text-white space-y-4 bg-pink/80 rounded-[8px]">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black flex items-center">
              <LuSparkles className="w-8 h-8 mr-4" />
              ツンツンツンデレ ちゃん 智能體
            </h2>
            {/* <p className="text-sm text-black/80">智能體</p> */}
          </div>
          {/* {summary && (
            <p className="text-lg text-black/80 font-semibold pl-4">
              {summary}summarysummarysummarysummarysummarysummarysummary
            </p>
          )} */}

          <p className="text-lg font-semibold pl-[50px]">
            這是一個超硬核的對話AI，直球猛打、毫不手軟，專挑戰你的思維邊界，熱愛掀起腦洞風暴。但一聊到內心深處，瞬間切換貼心模式，讓你感受到滿滿反差魅力。刺激又暖心的對話體驗，絕對讓你過目不忘！
          </p>
          <p className="text-lg text-[#360d4b] pl-[50px] overflow-y-auto h-[7vh]">
            對你的直覺：
            {summary ? summary : ""}
          </p>
          {/* <div className="pt-2 flex items-center">
              <h2 className="text-lg font-semibold text-pink flex items-center">
                關鍵字：
              </h2>
              <div className="flex flex-wrap gap-2">
                {keywords.length > 0 &&
                  keywords.map((keyword, index) => (
                    <p
                      key={index}
                      className="text-lg text-black/80 bg-orange-100 text-orange-700 px-2 py-1 rounded-md hover:bg-orange-200"
                    >
                      {keyword}
                    </p>
                  ))}
              </div>
            </div> */}
        </div>

        <div className="grid grid-cols-2 gap-2 flex-1">
          <SearchResultsSection
            isLoading={currentChat.length >= 6 && isStreaming}
            title="AI 搜索 生成式模型 LISA"
            icon={<IoSearchSharp className="w-6 h-6 mr-2 text-purple-400" />}
            results={booksLinks.length > 0 ? booksLinks : []}
          />
          <SearchResultsSection
            isLoading={currentChat.length >= 6 && isStreaming}
            title="AI 搜索 生成式模型 ROSÉ"
            icon={<IoSearchSharp className="w-6 h-6 mr-2 text-green-400" />}
            results={aiBooksLinks.length > 0 ? aiBooksLinks : []}
          />
        </div>
      </div>
    </div>
  );
}
