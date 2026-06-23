"use client";

import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { t } from "@/lib/i18n";
import type { FavoriteEntry } from "@/hooks/useFavorites";

export type { FavoriteEntry };

export function FavoriteButton({ id, name }: FavoriteEntry) {
  const { isFavorite, toggle } = useFavorites();
  const isFav = isFavorite(id);

  return (
    <button
      onClick={() => toggle({ id, name })}
      aria-label={isFav ? t("favorites.remove") : t("favorites.add")}
      className={cn(
        "rounded-full p-2 text-xl transition-all hover:scale-110 active:scale-95",
        isFav ? "text-pk-yellow" : "text-muted-foreground/40 hover:text-pk-yellow/60"
      )}
    >
      {isFav ? "★" : "☆"}
    </button>
  );
}
