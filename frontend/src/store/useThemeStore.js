import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('stream-theme') || 'forest',
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('stream-theme', theme)
  },
}))