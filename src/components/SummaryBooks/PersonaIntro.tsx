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
            unoptimized
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
    </>
  );
};

export default PersonaIntro;
