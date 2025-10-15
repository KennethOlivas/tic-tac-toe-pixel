import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Language = "en" | "es"

interface AppState {
  language: Language
  audioEnabled: boolean
  animationsEnabled: boolean
  setLanguage: (lang: Language) => void
  toggleAudio: () => void
  toggleAnimations: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: "en",
      audioEnabled: true,
      animationsEnabled: true,
      setLanguage: (lang) => set({ language: lang }),
      toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
    }),
    {
      name: "tictactoe-app-storage",
    },
  ),
)
