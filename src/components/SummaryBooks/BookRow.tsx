"use client";
import React from "react";
import { BookData } from "@/types";
import Image from "next/image";
import { FaBook } from "react-icons/fa";

interface BookRowProps {
  book: BookData;
}

const BookRow = ({ book }: BookRowProps) => {
  return (
    <div
      onClick={() => {
        window.open(book.link, "_blank");
      }}
      className="flex bg-white p-4 items-center cursor-pointer hover:bg-[#b6b6b6] gap-4 transition-all duration-300 rounded-[4px]"
    >
      {book?.image ? (
        <Image
          src={book.image}
          alt={book.title}
          className="w-20 h-[110px]"
          width={400}
          height={310}
          unoptimized
        />
      ) : (
        <div className="w-20 h-[110px] bg-transparent flex items-center justify-center">
          <FaBook className="size-4" color="#000000" />
        </div>
      )}
      <div className="flex flex-col flex-1 gap-3">
        <div className="flex gap-1">
          {book.keywords &&
            book.keywords.length > 0 &&
            book.keywords.map((keyword, index) => (
              <div
                key={index}
                className="rounded-[4px] bg-[#CAC3BB] p-[6px] text-[12px]"
              >
                {keyword}
              </div>
            ))}
        </div>
        <p className="text-sm font-bold">{book.title}</p>
        <p className="text-sm text-black/50 line-clamp-3">{book.description}</p>
      </div>
    </div>
  );
};

export default BookRow;
