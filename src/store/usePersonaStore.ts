import { create } from "zustand";
import { Persona } from "@/types";

interface PersonaState {
  personas: Persona[];
  personaId: string;
  setPersonaId: (id: string) => void;
  fetchPersonas: () => Promise<void>;
}

export const usePersonaStore = create<PersonaState>((set) => ({
  personas: [],
  personaId: "67606f5956a9919e381b5319",
  setPersonaId: (id) => set({ personaId: id }),
  fetchPersonas: async () => {
    try {
      const response = await fetch("/api/persona?getAllPersona=true"); // 替換成你的 API 端點
      const resData = await response.json();
      set({
        personas: resData.personas,
        personaId: resData.personas.length > 0 ? resData.personas[0]._id : "",
      });
    } catch (error) {
      console.error("Failed to fetch personas:", error);
    }
  },
}));
