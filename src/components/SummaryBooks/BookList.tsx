"use client";
import React from "react";
import { Message } from "@/types";
import BookRow from "./BookRow";

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
      <p className="text-xs text-white">
        {(!currentChat || currentChat.length === 0
          ? chatHistory
              ?.filter((msg) => msg.query_tag === "summary")
              .slice(-1)[0]?.content
          : currentChat
              ?.filter((msg) => msg.query_tag === "summary")
              .slice(-1)[0]?.content) || ""}
      </p>
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
