import {
  addFavorite,
  removeFavorite,
  getFavorites,
  subscribeToFavorites,
} from "../favorites";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "favorites-collection"),
  doc: jest.fn(() => "favorite-doc"),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(() => "server-time"),
}));
jest.mock("@/lib/firebase", () => ({ getFirebaseDb: jest.fn(() => "db") }));

describe("favorites service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("writes a favorite doc with a server timestamp", async () => {
    await addFavorite("user-1", { id: "25", name: "pikachu" });
    expect(doc).toHaveBeenCalledWith("db", "users", "user-1", "favorites", "25");
    expect(setDoc).toHaveBeenCalledWith("favorite-doc", {
      id: "25",
      name: "pikachu",
      createdAt: "server-time",
    });
    expect(serverTimestamp).toHaveBeenCalled();
  });

  it("strips undefined fields before writing", async () => {
    await addFavorite("user-1", {
      id: "25",
      name: "pikachu",
      sprite: undefined,
    } as Parameters<typeof addFavorite>[1]);
    const written = (setDoc as jest.Mock).mock.calls[0][1];
    expect("sprite" in written).toBe(false);
  });

  it("deletes a favorite doc", async () => {
    await removeFavorite("user-1", "25");
    expect(doc).toHaveBeenCalledWith("db", "users", "user-1", "favorites", "25");
    expect(deleteDoc).toHaveBeenCalledWith("favorite-doc");
  });

  it("maps favorite docs from a snapshot", async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => ({ id: "25", name: "pikachu" }) }],
    });
    const favorites = await getFavorites("user-1");
    expect(collection).toHaveBeenCalledWith("db", "users", "user-1", "favorites");
    expect(favorites).toEqual([{ id: "25", name: "pikachu" }]);
  });

  it("subscribes to favorites and forwards snapshot data", () => {
    const unsubscribe = jest.fn();
    (onSnapshot as jest.Mock).mockImplementation((_ref, cb) => {
      cb({ docs: [{ data: () => ({ id: "1", name: "bulbasaur" }) }] });
      return unsubscribe;
    });
    const callback = jest.fn();
    const result = subscribeToFavorites("user-1", callback);
    expect(callback).toHaveBeenCalledWith([{ id: "1", name: "bulbasaur" }]);
    expect(result).toBe(unsubscribe);
  });

  describe("cypress e2e seam", () => {
    type E2EWindow = Window & {
      Cypress?: unknown;
      __E2E_FAVORITES__?: { id: string; name: string }[];
    };
    const w = window as E2EWindow;

    beforeEach(() => {
      w.Cypress = {};
      w.__E2E_FAVORITES__ = [{ id: "1", name: "bulbasaur" }];
    });

    afterEach(() => {
      delete w.Cypress;
      delete w.__E2E_FAVORITES__;
    });

    it("subscribes to the in-memory store instead of Firestore", () => {
      const callback = jest.fn();
      const unsubscribe = subscribeToFavorites("user-1", callback);
      expect(callback).toHaveBeenCalledWith([{ id: "1", name: "bulbasaur" }]);
      expect(onSnapshot).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("adds to the in-memory store and notifies subscribers", async () => {
      const callback = jest.fn();
      const unsubscribe = subscribeToFavorites("user-1", callback);
      await addFavorite("user-1", { id: "25", name: "pikachu" });
      expect(callback).toHaveBeenLastCalledWith([
        { id: "1", name: "bulbasaur" },
        { id: "25", name: "pikachu" },
      ]);
      expect(setDoc).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("replaces an existing favorite with the same id", async () => {
      await addFavorite("user-1", { id: "1", name: "ivysaur" });
      expect(w.__E2E_FAVORITES__).toEqual([{ id: "1", name: "ivysaur" }]);
    });

    it("removes from the in-memory store and notifies subscribers", async () => {
      const callback = jest.fn();
      const unsubscribe = subscribeToFavorites("user-1", callback);
      await removeFavorite("user-1", "1");
      expect(callback).toHaveBeenLastCalledWith([]);
      expect(deleteDoc).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("stops notifying after unsubscribe", async () => {
      const callback = jest.fn();
      const unsubscribe = subscribeToFavorites("user-1", callback);
      unsubscribe();
      callback.mockClear();
      await addFavorite("user-1", { id: "25", name: "pikachu" });
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
