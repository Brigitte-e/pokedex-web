import { useFavoritesStore } from "../favorites";

const entry = (id: string, name = `pokemon-${id}`) => ({ id, name });

describe("useFavoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
    localStorage.clear();
  });

  it("adds an entry with toggle", () => {
    useFavoritesStore.getState().toggle(entry("25"));
    expect(useFavoritesStore.getState().favorites).toEqual([entry("25")]);
  });

  it("removes an existing entry with toggle", () => {
    useFavoritesStore.getState().toggle(entry("25"));
    useFavoritesStore.getState().toggle(entry("25"));
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });

  it("removes an entry by id", () => {
    useFavoritesStore.getState().toggle(entry("25"));
    useFavoritesStore.getState().toggle(entry("1"));
    useFavoritesStore.getState().remove("25");
    expect(useFavoritesStore.getState().favorites).toEqual([entry("1")]);
  });

  it("clears all entries", () => {
    useFavoritesStore.getState().toggle(entry("25"));
    useFavoritesStore.getState().toggle(entry("1"));
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });

  it("reports favorite status with isFavorite", () => {
    useFavoritesStore.getState().toggle(entry("25"));
    expect(useFavoritesStore.getState().isFavorite("25")).toBe(true);
    expect(useFavoritesStore.getState().isFavorite("1")).toBe(false);
  });

  it("migrates v0 numeric ids to strings", () => {
    const migrate = useFavoritesStore.persist.getOptions().migrate!;
    const migrated = migrate({ favorites: [{ id: 25, name: "pikachu" }] }, 0) as {
      favorites: { id: string; name: string }[];
    };
    expect(migrated.favorites).toEqual([{ id: "25", name: "pikachu" }]);
  });
});
