"use client";
import React from "react";
import { Message } from "@/types";
import BookRow from "./BookRow";
import { RiBookShelfLine } from "react-icons/ri";

interface BookListProps {
  chatHistory: Message[];
  currentChat: Message[];
  isStreaming: boolean;
}

const BookList = ({
  chatHistory,
  // isStreaming,
  currentChat,
}: BookListProps) => {
  // const chatHistory_bookList_distinct = [...chatHistory]
  //   .reverse()
  //   .flatMap((message) => message.book_list || [])
  //   .filter(
  //     (book, index, self) =>
  //       index === self.findIndex((b) => b.isbn === book.isbn)
  //   );
  // const books_distinct = books
  //   ? books.filter(
  //       (book, index, self) =>
  //         index === self.findIndex((b) => b.isbn === book.isbn)
  //     )
  //   : [];

  return (
    <div className="w-full h-full pb-2 overflow-y-auto flex pl-16 flex-col gap-2 pr-4">
      <div className="flex gap-4 p-4 bg-[#3C3C3C] items-center rounded">
        <RiBookShelfLine className="text-white" size={50} />
        <p className="text-xs text-white">
          {`以下的書單是根據您前三次的查詢精心推薦的。我們即將推出 Pro 版，將根據您的對話持續更新，支援無限次查詢，並提供更多豐富功能，敬請期待！`}
          {/* {(!currentChat || currentChat.length === 0
          ? chatHistory
              ?.filter((msg) => msg.query_tag === "summary")
              .slice(-1)[0]?.content
          : currentChat
              ?.filter((msg) => msg.query_tag === "summary")
              .slice(-1)[0]?.content) || ""} */}
        </p>
      </div>
      <div className="gap-2 flex flex-col w-full rounded-b-lg">
        {(!currentChat || currentChat.length === 0
          ? chatHistory?.[chatHistory.length - 1]?.book_list || []
          : currentChat?.[currentChat.length - 1]?.book_list || []
        )
          .filter(
            (book, index, self) =>
              index === self.findIndex((b) => b.isbn === book.isbn)
          )
          .map((book, index) => (
            <BookRow key={index} book={book} />
          ))}
      </div>
    </div>
  );
};

export default BookList;
