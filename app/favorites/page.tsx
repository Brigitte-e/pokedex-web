"use client";

import { useEffect, useState } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import { getFavorites, saveFavorites, type FavoriteEntry } from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function remove(id: number) {
    const updated = favorites.filter((f) => f.id !== id);
    saveFavorites(updated);
    setFavorites(updated);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold text-pk-yellow mb-2 tracking-tight">Favorites</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        {favorites.length === 0
          ? "No favorites yet. Star a Pokémon on its detail page."
          : `${favorites.length} saved Pokémon`}
      </p>

      {favorites.length > 0 && (
        <>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {favorites.map((fav) => (
              <li key={fav.id} className="relative group/fav">
                <CharacterCard id={fav.id} name={fav.name} />
                <button
                  onClick={() => remove(fav.id)}
                  className="absolute top-2 right-2 rounded-full bg-background/80 p-1 text-xs text-muted-foreground opacity-0 group-hover/fav:opacity-100 hover:text-destructive transition-all"
                  aria-label="Remove from favorites"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              saveFavorites([]);
              setFavorites([]);
            }}
            className="mt-8 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear all favorites
          </button>
        </>
      )}
    </main>
  );
}
