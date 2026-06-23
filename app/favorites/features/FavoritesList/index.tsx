"use client";

import { CharacterCard } from "@/components/CharacterCard";
import { useFavorites } from "@/hooks/useFavorites";

export function FavoritesList() {
  const { favorites, remove, clear } = useFavorites();

  if (favorites.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No favorites yet. Star a Pokémon on its detail page.
      </p>
    );
  }

  return (
    <>
      <p className="text-muted-foreground mb-8 text-sm">
        {favorites.length} saved Pokémon
      </p>

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
        onClick={clear}
        className="mt-8 text-xs text-muted-foreground hover:text-destructive transition-colors"
      >
        Clear all favorites
      </button>
    </>
  );
}
