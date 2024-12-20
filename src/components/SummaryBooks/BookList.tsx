"use client";
import React from "react";
import { BookData } from "@/types";
import { Message } from "@/types";
import BookRow from "./BookRow";

interface BookListProps {
  chatHistory: Message[];
  books: BookData[] | null;
  summary: string;
  isStreaming: boolean;
}

const BookList = ({
  summary,
  chatHistory,
  // isStreaming,
  books,
}: BookListProps) => {
  const chatHistory_bookList_distinct = [...chatHistory]
    .reverse()
    .flatMap((message) => message.book_list || [])
    .filter(
      (book, index, self) =>
        index === self.findIndex((b) => b.isbn === book.isbn)
    );
  const books_distinct = books
    ? books.filter(
        (book, index, self) =>
          index === self.findIndex((b) => b.isbn === book.isbn)
      )
    : [];

  return (
    <div className="w-full h-full flex pl-16 flex-col gap-2 pr-4">
      <p className="text-xs text-white">{summary}</p>
      <div className="h-full overflow-y-auto w-full rounded-b-lg">
        {books_distinct &&
          books_distinct.length > 0 &&
          books_distinct.map((book, index) => (
            <BookRow key={index} book={book} />
          ))}
        {chatHistory &&
          chatHistory.length > 0 &&
          chatHistory_bookList_distinct.map((book, index) => (
            <BookRow key={index} book={book} />
          ))}
      </div>
    </div>
  );
};

export default BookList;
