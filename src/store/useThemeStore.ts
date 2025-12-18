import { create } from "zustand";

interface ThemeStoreTypes {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStoreTypes>((set) => ({
  theme: localStorage.getItem("chat-theme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
