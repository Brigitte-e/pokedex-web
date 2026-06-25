"use client";

import { FAVORITES_STORAGE_KEY } from "@/lib/constants";
import { useState } from "react";

export interface FavoriteEntry {
  id: number;
  name: string;
}

export function getFavorites(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveFavorites(favs: FavoriteEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
  } catch {
    // storage quota exceeded or access denied — silently ignore
  }
}

export function useFavorites() {
  // getFavorites is the lazy initializer: it runs once on the client and returns
  // [] on the server (typeof window guard), so SSR and initial client HTML match.
  const [favorites, setFavorites] = useState<FavoriteEntry[]>(getFavorites);

  function toggle(entry: FavoriteEntry) {
    const isFav = favorites.some((f) => f.id === entry.id);
    const updated = isFav
      ? favorites.filter((f) => f.id !== entry.id)
      : [...favorites, entry];
    saveFavorites(updated);
    setFavorites(updated);
  }

  function remove(id: number) {
    const updated = favorites.filter((f) => f.id !== id);
    saveFavorites(updated);
    setFavorites(updated);
  }

  function clear() {
    saveFavorites([]);
    setFavorites([]);
  }

  function isFavorite(id: number) {
    return favorites.some((f) => f.id === id);
  }

  return { favorites, toggle, remove, clear, isFavorite };
}
