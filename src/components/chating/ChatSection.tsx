"use client";
import Loading from "@/components/Loading";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "@/types";
import { usePersonaStore } from "@/store/usePersonaStore";
import ReactMarkdown from "react-markdown";
import { personaIconMap } from "@/constants/personaMapping";
import Image from "next/image";
import LLMInput from "../Input";
import QueryBookRow from "./QueryBookRow";
import { TbTrash } from "react-icons/tb";
import { cn } from "@/lib/utils";

interface ChatSectionProps {
  currentChat?: Message[];
  chatHistory?: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  shouldShowFullWidth: boolean;
  handleQuery: (userId: string, userQuery: string, personaId: string) => void;
  handleDeleteChatHistory: () => void;
  className?: string;
}

const ChatSection = ({
  currentChat,
  chatHistory,
  isLoading,
  isStreaming,
  handleQuery,
  handleDeleteChatHistory,
  className,
  shouldShowFullWidth,
}: ChatSectionProps) => {
  const { personaId } = usePersonaStore();
  // const defaultPrompt = ["你好我想要找逆思維這本書！"];
  const personaIcon = personaIconMap[personaId];
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  // const [bookListDistinct, setBookListDistinct] = useState<BookData[]>([]);
  // useEffect(() => {
  //   console.log("isLoading", isLoading);
  //   console.log("isStreaming", isStreaming);
  // }, [isLoading, isStreaming]);
  const updateBookList = useCallback((isbn: string) => {
    console.log("isbn", isbn);
    // setBookListDistinct((prev) => {
    //   const filtered = prev.filter((book) => book.isbn !== isbn);
    //   return filtered.length > 0 ? filtered : [];
    // });
  }, []);
  // 檢查是否在底部的函數
  const isNearBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const threshold = 300; // 距離底部多少像素內算是"接近底部"
      return (
        container.scrollHeight - container.scrollTop - container.clientHeight <
        threshold
      );
    }
    return false;
  }, []);

  // 滾動到底部的函數
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current && shouldAutoScroll && isStreaming) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [shouldAutoScroll, isStreaming]);

  // 監聽滾動事件
  useEffect(() => {
    const container = chatContainerRef.current;
    const handleScroll = () => {
      setShouldAutoScroll(isNearBottom());
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [isNearBottom]);

  // 當聊天內容更新時，根據條件滾動到底部
  useEffect(() => {
    scrollToBottom();
  }, [currentChat, scrollToBottom, isStreaming]);

  // 初始滾動到底部
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: chatHistory?.length > 13 ? "auto" : "smooth",
      });
    }
  }, [chatHistory]);
  return (
    <div
      ref={chatContainerRef}
      className={cn(
        "mx-auto relative bg-[#FFFFFF] rounded-lg px-6 pt-6 pb-24 gap-8 flex flex-col h-full overflow-y-auto",
        className
      )}
    >
      <div className="sticky top-0 left-0 z-10 -mb-[44px]">
        <div className="flex justify-start relative">
          <TbTrash
            className="w-4 h-4 cursor-pointer absolute -top-4 -left-4"
            onClick={() => handleDeleteChatHistory()}
          />
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col mx-auto gap-8",
          shouldShowFullWidth ? "max-w-[50%]" : "max-w-full"
        )}
      >
        {chatHistory && chatHistory.length === 0 && (
          <div className="flex gap-4 justify-start ">
            {personaIcon ? (
              <Image
                src={personaIcon}
                alt="personaIcon"
                className="w-6 h-6 rounded-full"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-6 h-6 rounded-full flex-shrink-0 border border-amber-700"></div>
            )}
            <div className="flex flex-col gap-6">
              <ReactMarkdown className="text-black bg-transparent max-w-2xl text-sm whitespace-pre-wrap">
                {`你可以跟我聊聊任何事情。如果有想找的書，隨時告訴我；如果只是想隨意聊聊，也沒關係。我會根據我們的對話，為你精選一份適合的書單，讓你的閱讀時光更加豐富有趣！`}
              </ReactMarkdown>
            </div>
          </div>
        )}
        {chatHistory?.map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex gap-4 ${
              message.role === "human" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "ai" &&
              (personaIcon ? (
                <Image
                  src={personaIcon}
                  alt="personaIcon"
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex-shrink-0 border border-amber-700"></div>
              ))}
            <div className="flex flex-col gap-6">
              <ReactMarkdown
                className={`${
                  message.role === "human"
                    ? "bg-black text-[#FFFFFF] p-4 rounded-3xl"
                    : "text-black bg-transparent"
                } max-w-2xl text-sm whitespace-pre-wrap`}
              >
                {message.content}
              </ReactMarkdown>
              {message.book_list && message.book_list.length > 0 && (
                <div className="flex flex-col gap-4">
                  {message.book_list.map((book, index) => (
                    <QueryBookRow
                      key={index}
                      book={book}
                      updateBookList={updateBookList}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {currentChat?.map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex gap-4 ${
              message.role === "human" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "ai" &&
              (personaIcon ? (
                <Image
                  src={personaIcon}
                  alt="personaIcon"
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex-shrink-0 border border-amber-700"></div>
              ))}
            <div className="flex flex-col gap-6">
              <ReactMarkdown
                className={`${
                  message.role === "human"
                    ? "bg-black text-[#FFFFFF] p-4 rounded-3xl"
                    : "text-black bg-transparent"
                } max-w-2xl text-sm whitespace-pre-wrap`}
              >
                {message.content}
              </ReactMarkdown>
              {message.book_list && message.book_list.length > 0 && (
                <div className="flex flex-col gap-4">
                  {message.book_list.map((book, index) => (
                    <QueryBookRow
                      key={index}
                      book={book}
                      updateBookList={updateBookList}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <Loading />}
        <div className="fixed bottom-8 w-full left-0 z-10">
          <LLMInput
            isLoading={isLoading}
            handleSubmit={handleQuery}
            proMessage={"proMessage"}
            shouldShowFullWidth={shouldShowFullWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
