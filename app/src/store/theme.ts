import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    isDark: boolean;
    toggle: () => void;
    setDark: (val: boolean) => void;
}

export const themeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDark: false,
            toggle: () => set((state) => ({ isDark: !state.isDark })),
            setDark: (val: boolean) => set({ isDark: val }),
        }),
        { name: 'relay-theme' }
    )
);
