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

interface ChatSectionProps {
  currentChat?: Message[];
  chatHistory?: Message[];
  isLoading?: boolean;
  isStreaming?: boolean;
  handleQuery: (userId: string, userQuery: string, personaId: string) => void;
}

const ChatSection = ({
  currentChat,
  chatHistory,
  isLoading,
  isStreaming,
  handleQuery,
}: ChatSectionProps) => {
  const { personaId } = usePersonaStore();
  // const defaultPrompt = ["你好我想要找逆思維這本書！"];
  const personaIcon = personaIconMap[personaId];
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  // const [bookListDistinct, setBookListDistinct] = useState<BookData[]>([]);
  useEffect(() => {
    console.log("isLoading", isLoading);
    console.log("isStreaming", isStreaming);
  }, [isLoading, isStreaming]);
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
      className="w-1/2 mx-auto relative bg-[#FFFFFF] rounded-lg px-6 pt-6 pb-24 gap-8 flex flex-col h-full overflow-y-auto"
    >
      {chatHistory && chatHistory.length === 0 && (
        <div className="flex gap-4 justify-start">
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
              {`你可以跟我說任何事情。如果有書想找的話，就直接告訴我吧；如果沒有的話，也可以隨便聊聊，沒關係的。`}
            </ReactMarkdown>
            {/* {defaultPrompt && (
              <PromptList prompts={defaultPrompt} handleQuery={handleQuery} />
            )} */}
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
      <LLMInput handleSubmit={handleQuery} proMessage={"proMessage"} />
    </div>
  );
};

export default ChatSection;
