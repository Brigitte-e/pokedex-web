import { usePokemonOfTheDayStore } from "../pokemon-of-the-day";

describe("usePokemonOfTheDayStore", () => {
  beforeEach(() => {
    usePokemonOfTheDayStore.setState({ revealedDayKey: null, hydrated: false });
    localStorage.clear();
  });

  it("starts unrevealed and unhydrated", () => {
    expect(usePokemonOfTheDayStore.getState().revealedDayKey).toBeNull();
    expect(usePokemonOfTheDayStore.getState().hydrated).toBe(false);
  });

  it("stores the day key on reveal", () => {
    usePokemonOfTheDayStore.getState().reveal("20000");
    expect(usePokemonOfTheDayStore.getState().revealedDayKey).toBe("20000");
  });

  it("marks the store hydrated after rehydration", async () => {
    await usePokemonOfTheDayStore.persist.rehydrate();
    expect(usePokemonOfTheDayStore.getState().hydrated).toBe(true);
  });

  it("only persists the revealed day key", () => {
    const partialize = usePokemonOfTheDayStore.persist.getOptions().partialize!;
    expect(partialize(usePokemonOfTheDayStore.getState())).toEqual({ revealedDayKey: null });
  });
});
