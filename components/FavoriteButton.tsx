"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "pokemon-favorites";

export interface FavoriteEntry {
  id: number;
  name: string;
}

export function getFavorites(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveFavorites(favs: FavoriteEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function FavoriteButton({ id, name }: FavoriteEntry) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = getFavorites();
    setIsFav(favs.some((f) => f.id === id));
  }, [id]);

  function toggle() {
    const favs = getFavorites();
    if (isFav) {
      saveFavorites(favs.filter((f) => f.id !== id));
      setIsFav(false);
    } else {
      saveFavorites([...favs, { id, name }]);
      setIsFav(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "rounded-full p-2 text-xl transition-all hover:scale-110 active:scale-95",
        isFav ? "text-pk-yellow" : "text-muted-foreground/40 hover:text-pk-yellow/60"
      )}
    >
      {isFav ? "★" : "☆"}
    </button>
  );
}
