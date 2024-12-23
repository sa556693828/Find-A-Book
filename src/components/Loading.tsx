import { personaIconMap } from "@/constants/personaMapping";
import { usePersonaStore } from "@/store/usePersonaStore";
import Image from "next/image";

export default function Loading() {
  const { personaId, personas } = usePersonaStore();
  const personaIcon = personaIconMap[personaId];
  const getRandomMessage = () => {
    const persona = personas.find((persona) => persona._id === personaId);
    if (!persona) return;
    const randomIndex = Math.floor(
      Math.random() * persona.waiting_message.length
    );
    return persona.waiting_message[randomIndex];
  };
  const randomMessage = getRandomMessage();
  return (
    <div className="flex justify-start items-center w-full gap-4 ">
      {personaIcon ? (
        <Image
          src={personaIcon}
          alt="personaIcon"
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
          unoptimized
        />
      ) : (
        <div className="w-10 h-10 rounded-full border border-amber-700"></div>
      )}
      <div className="relative w-full h-[1px] bg-black opacity-40">
        <div className="text-xs absolute text-center max-w-2/3 justify-center items-center left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-4 rounded-full text-black">
          {randomMessage}
        </div>
      </div>
    </div>
  );
}
