import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "pokemon-of-the-day";

interface PokemonOfTheDayState {
  /** UTC day key of the last reveal; the pick is only shown when it matches today. */
  revealedDayKey: string | null;
  /** False until the persisted reveal has been loaded; render a skeleton meanwhile. */
  hydrated: boolean;
  reveal: (dayKey: string) => void;
}

export const usePokemonOfTheDayStore = create<PokemonOfTheDayState>()(
  persist(
    (set) => ({
      revealedDayKey: null,
      hydrated: false,
      reveal: (dayKey) => set({ revealedDayKey: dayKey }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ revealedDayKey: state.revealedDayKey }),
      version: 1,
      // v0 persisted the whole pokemon object under different keys; start fresh.
      migrate: () => ({ revealedDayKey: null }),
      // Rehydrate manually after mount so server and hydration renders match.
      skipHydration: true,
      onRehydrateStorage: () => () => {
        usePokemonOfTheDayStore.setState({ hydrated: true });
      },
    },
  ),
);
