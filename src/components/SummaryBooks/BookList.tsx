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
  // chatHistory,
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
    <div className="w-full h-full flex pl-16 flex-col gap-2 pr-4">
      <p className="text-xs text-white">
        {currentChat.filter((msg) => msg.query_tag === "summary").slice(-1)[0]
          ?.content || ""}
      </p>
      <div className="h-[66vh] overflow-y-auto gap-2 flex pb-2 flex-col w-full rounded-b-lg">
        {/* {books_distinct &&
          books_distinct.length > 0 &&
          books_distinct.map((book, index) => (
            <BookRow key={index} book={book} />
          ))} */}
        {currentChat &&
          currentChat.length > 0 &&
          [...(currentChat[currentChat.length - 1].book_list || [])]
            .filter(
              (book, index, self) =>
                index === self.findIndex((b) => b.isbn === book.isbn)
            )
            .map((book, index) => <BookRow key={index} book={book} />)}
      </div>
    </div>
  );
};

export default BookList;
