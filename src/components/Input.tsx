"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { usePersonaStore } from "@/store/usePersonaStore";
import React, { useRef, useState } from "react";

interface LLMInputProps {
  handleSubmit: (userId: string, inputValue: string, personaId: string) => void;
  proMessage: string;
}

const LLMInput = ({ handleSubmit }: LLMInputProps) => {
  const { userId } = useAuthStore();
  const { personaId } = usePersonaStore();
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
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
          await handleSubmit(userId || "", currentInput, personaId || "");
          adjustHeight();
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(userId || "", inputValue, personaId || "");
      }}
      className="flex gap-2 fixed bottom-6 w-[calc((50%-6px)*0.9)]  left-1/4 -translate-x-1/2"
    >
      <div className="flex items-start w-full bg-black rounded-3xl ">
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
          className="flex-1 bg-transparent px-4 py-3 text-white disabled:text-gray-400 placeholder-gray-400 focus:outline-none resize-none min-h-[48px] max-h-[200px] overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4B5563 transparent",
          }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`px-4 py-3 transition-colors self-end ${
            inputValue.trim()
              ? "text-white hover:text-gray-300 cursor-pointer"
              : "text-gray-600 cursor-not-allowed"
          }`}
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
  );
};

export default LLMInput;
