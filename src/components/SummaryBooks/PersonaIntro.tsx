"use client";
import React from "react";
import Image from "next/image";
import { usePersonaStore } from "@/store/usePersonaStore";
import { personaIconMap } from "@/constants/personaMapping";
import { Message } from "@/types";

const PersonaIntro = ({
  currentChat,
  chatHistory,
}: {
  currentChat: Message[];
  chatHistory: Message[] | null;
}) => {
  const { personaId, personas } = usePersonaStore();
  const personaName = personas.find(
    (persona) => persona._id === personaId
  )?.persona_name;

  return (
    <>
      <div className="h-fit pt-4 pr-4 bg-black rounded-t-lg items-start flex w-full">
        <div className="flex w-16 justify-center flex-shrink-0 items-start">
          <Image
            src={personaIconMap[personaId]}
            alt="personaIconMap"
            className={`rounded-full size-8 ${
              personaId === personaId ? "" : "opacity-30"
            }
            `}
            // ${
            //   isStreaming
            //     ? "cursor-not-allowed"
            //     : "cursor-pointer hover:opacity-80"
            // }
            width={40}
            height={40}
            // onClick={() => {
            //   setModelOpen(true);
            //   setModelPersonaId(personaId);
            // }}
          />
        </div>
        <div className="flex flex-col justify-center gap-3 text-white">
          {personaName && (
            <div className="flex gap-4">
              <p className="text-2xl">{personaName}</p>
              <p className="text-2xl opacity-30">智能體</p>
            </div>
          )}
          <p className="text-xs">
            {(!currentChat || currentChat.length === 0
              ? chatHistory
                  ?.filter((msg) => msg.query_tag === "summary")
                  .slice(-1)[0]?.content
              : currentChat
                  ?.filter((msg) => msg.query_tag === "summary")
                  .slice(-1)[0]?.content) || ""}
          </p>
        </div>
      </div>
      {/* {modelOpen && (
        <div
          onClick={() => setModelOpen(false)} // 點擊背景關閉
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // 防止點擊內容區域時關閉
            className="bg-white flex flex-col rounded-lg max-w-md w-full"
          >
            <Image
              src={personaIconMap[modelPersonaId]}
              alt="persona"
              width={1000}
              height={1000}
              className="w-full h-full rounded-t-lg"
            />
            <div className="flex flex-col gap-4 px-4 py-8">
              <h3 className="text-2xl font-bold">
                {
                  personas.find((persona) => persona._id === modelPersonaId)
                    ?.persona_name
                }
              </h3>
              <p className="text-base leading-relaxed">
                {isStreaming
                  ? `等等，它還沒說完！請等待當前對話結束後再切換智能體。`
                  : personas.find((persona) => persona._id === modelPersonaId)
                      ?.intro}
              </p>
              <button
                className="w-1/2 mx-auto bg-black text-white font-bold h-[42px] rounded-lg"
                onClick={() => {
                  if (isStreaming) {
                    setModelOpen(false);
                  } else {
                    setModelOpen(false);
                    setPersonaId(modelPersonaId);
                  }
                }}
              >
                {isStreaming ? `我知道了` : `看看我推薦你讀什麼書`}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default PersonaIntro;
