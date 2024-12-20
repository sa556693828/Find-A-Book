"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { usePersonaStore } from "@/store/usePersonaStore";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";

interface PromptListProps {
  prompts: string[];
  handleQuery: (userId: string, inputValue: string, personaId: string) => void;
}

const PromptList = ({ prompts, handleQuery }: PromptListProps) => {
  const { userId } = useAuthStore();
  const { personaId } = usePersonaStore();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-black font-bold">繼續問</p>
      <div className="flex flex-col">
        {prompts.map((prompt, index) => (
          <div key={index} className="py-3 border-t border-black/30">
            <div
              onClick={() => handleQuery(userId || "", prompt, personaId || "")}
              className="flex items-center gap-2 cursor-pointer hover:translate-x-2 transition-all duration-300"
            >
              <IoIosArrowRoundForward size={24} className="text-black" />
              <p className="text-sm text-black">{prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptList;
