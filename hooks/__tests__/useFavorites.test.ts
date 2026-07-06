import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "../useFavorites";
import { useAuthStore } from "@/store/auth";
import { useFavoritesStore } from "@/store/favorites";
import {
  addFavorite,
  removeFavorite,
  subscribeToFavorites,
} from "@/lib/services/favorites";
import type { User } from "firebase/auth";
import type { FavoriteItem } from "@/types/favorite";

jest.mock("@/lib/services/favorites", () => ({
  addFavorite: jest.fn().mockResolvedValue(undefined),
  removeFavorite: jest.fn().mockResolvedValue(undefined),
  subscribeToFavorites: jest.fn(),
}));

const subscribeMock = subscribeToFavorites as jest.Mock;
const user = { uid: "user-1" } as User;

/** Captures the snapshot callback so tests can push Firestore data. */
let pushSnapshot: (items: FavoriteItem[]) => void;

describe("useFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({ user: null, loading: false });
    useFavoritesStore.setState({ favorites: [] });
    subscribeMock.mockImplementation((_uid: string, cb: typeof pushSnapshot) => {
      pushSnapshot = cb;
      return jest.fn();
    });
  });

  describe("as a guest", () => {
    it("is not authenticated and reads from the local store", () => {
      useFavoritesStore.setState({ favorites: [{ id: "25", name: "pikachu" }] });
      const { result } = renderHook(() => useFavorites());
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.favorites).toEqual([{ id: "25", name: "pikachu" }]);
      expect(result.current.isFavorite("25")).toBe(true);
    });

    it("toggles favorites in the local store", async () => {
      const { result } = renderHook(() => useFavorites());
      await act(async () => {
        await result.current.toggle({ id: "25", name: "pikachu" });
      });
      expect(useFavoritesStore.getState().favorites).toEqual([{ id: "25", name: "pikachu" }]);
      expect(addFavorite).not.toHaveBeenCalled();
    });

    it("removes and clears favorites in the local store", async () => {
      useFavoritesStore.setState({
        favorites: [
          { id: "25", name: "pikachu" },
          { id: "1", name: "bulbasaur" },
        ],
      });
      const { result } = renderHook(() => useFavorites());
      await act(async () => {
        await result.current.remove("25");
      });
      expect(useFavoritesStore.getState().favorites).toEqual([{ id: "1", name: "bulbasaur" }]);
      await act(async () => {
        await result.current.clear();
      });
      expect(useFavoritesStore.getState().favorites).toEqual([]);
    });
  });

  describe("when signed in", () => {
    beforeEach(() => {
      useAuthStore.setState({ user, loading: false });
    });

    it("subscribes to Firestore and loads until the first snapshot", () => {
      const { result } = renderHook(() => useFavorites());
      expect(subscribeMock).toHaveBeenCalledWith("user-1", expect.any(Function));
      expect(result.current.loading).toBe(true);

      act(() => pushSnapshot([{ id: "25", name: "pikachu" }]));
      expect(result.current.loading).toBe(false);
      expect(result.current.favorites).toEqual([{ id: "25", name: "pikachu" }]);
    });

    it("adds a new favorite through the service", async () => {
      const { result } = renderHook(() => useFavorites());
      act(() => pushSnapshot([]));
      await act(() => result.current.toggle({ id: "25", name: "pikachu" }));
      expect(addFavorite).toHaveBeenCalledWith("user-1", { id: "25", name: "pikachu" });
    });

    it("removes an existing favorite through the service", async () => {
      const { result } = renderHook(() => useFavorites());
      act(() => pushSnapshot([{ id: "25", name: "pikachu" }]));
      await act(() => result.current.toggle({ id: "25", name: "pikachu" }));
      expect(removeFavorite).toHaveBeenCalledWith("user-1", "25");
    });

    it("clears all favorites through the service", async () => {
      const { result } = renderHook(() => useFavorites());
      act(() =>
        pushSnapshot([
          { id: "25", name: "pikachu" },
          { id: "1", name: "bulbasaur" },
        ]),
      );
      await act(() => result.current.clear());
      expect(removeFavorite).toHaveBeenCalledTimes(2);
    });

    it("unsubscribes on unmount", () => {
      const unsubscribe = jest.fn();
      subscribeMock.mockImplementation(() => unsubscribe);
      const { unmount } = renderHook(() => useFavorites());
      unmount();
      expect(unsubscribe).toHaveBeenCalled();
    });
  });
});
