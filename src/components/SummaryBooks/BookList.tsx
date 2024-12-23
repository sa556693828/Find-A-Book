"use client";
import React from "react";
import { Message } from "@/types";
import BookRow from "./BookRow";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoIosInfinite } from "react-icons/io";
import { BsStars } from "react-icons/bs";
import { IoIosChatboxes } from "react-icons/io";

interface BookListProps {
  chatHistory: Message[];
  currentChat: Message[];
}

const BookList = ({ chatHistory, currentChat }: BookListProps) => {
  return (
    <div className="w-full h-full pb-2 overflow-y-auto flex pl-16 flex-col gap-2 pr-4">
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
      <div className="flex flex-col gap-6 p-6 bg-[#3C3C3C] items-start rounded">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BsFillLightningChargeFill className="text-white" size={20} />
            <span className="text-white text-2xl font-bold tracking-wide">
              Pro
            </span>
          </div>
          <p className="text-sm text-white/60">
            根據您的前三次查詢，我已精心推薦書單，Pro
            專業版將帶來更多升級功能，讓您的體驗更上一層樓！
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <div className="rounded-lg bg-[#606060] size-9 flex items-center justify-center">
              <IoIosChatboxes size={20} className="text-white -scale-x-100" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-sm leading-none font-bold">
                進階分析
              </span>
              <span className="text-white/60 text-xs leading-none">
                {`提供更深入的分析功能，確保篩內容更準確貼合需求`}
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="rounded-lg bg-[#606060] size-9 flex items-center justify-center">
              <IoIosInfinite size={20} className="text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-sm leading-none font-bold">
                無限制使用
              </span>
              <span className="text-white/60 text-xs leading-none">
                {`支援無限次查詢，讓您暢享無拘無束的體驗`}
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="rounded-lg bg-[#606060] size-9 flex items-center justify-center">
              <BsStars size={20} className="text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-sm leading-none font-bold">
                未來功能
              </span>
              <span className="text-white/60 text-xs leading-none">
                {`解鎖更多精彩功能，全面提升使用滿足感`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
