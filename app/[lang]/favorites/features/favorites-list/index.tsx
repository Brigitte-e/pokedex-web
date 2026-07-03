"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FavoriteCard } from "@/components/FavoriteCard";
import { ClearFavoritesButton } from "@/components/ClearFavoritesButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useLocalizedPokemonNames } from "@/hooks/useLocalizedPokemonNames";
import { useAuthStore } from "@/store/auth";
import type { Locale } from "@/lib/constants";

interface FavLabels {
  loading: string;
  empty: string;
  savedCountPattern: string;
  removeLabel: string;
  clearAll: string;
  confirmRemove: string;
  confirmRemoveCancel: string;
  confirmRemoveConfirm: string;
  confirmClearAll: string;
  confirmClearAllConfirm: string;
}

interface Props {
  labels: FavLabels;
  locale: Locale;
}

export function FavoritesList({ labels, locale }: Props) {
  const { favorites, remove, clear, isAuthenticated, loading } = useFavorites();
  const authLoading = useAuthStore((s) => s.loading);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/${locale}/login`);
    }
  }, [authLoading, isAuthenticated, locale, router]);

  const names = useMemo(() => favorites.map((f) => f.name), [favorites]);
  const pokemonNames = useLocalizedPokemonNames(names, locale);

  if (authLoading || !isAuthenticated || loading) {
    return <p className="text-muted-foreground text-sm">{labels.loading}</p>;
  }

  if (favorites.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {labels.empty}
      </p>
    );
  }

  return (
    <>
      <p className="text-muted-foreground mb-8 text-sm">
        {labels.savedCountPattern.replace("{count}", String(favorites.length))}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {favorites.map((fav) => {
          return (
            <FavoriteCard
              key={fav.id}
              id={Number(fav.id)}
              name={fav.name}
              displayName={pokemonNames.get(fav.name)}
              locale={locale}
              onRemove={() => remove(fav.id)}
              removeLabel={labels.removeLabel}
              confirmRemove={labels.confirmRemove}
              confirmRemoveCancel={labels.confirmRemoveCancel}
              confirmRemoveConfirm={labels.confirmRemoveConfirm}
            />
          );
        })}
      </div>

      <ClearFavoritesButton
        onClear={clear}
        label={labels.clearAll}
        confirmText={labels.confirmClearAll}
        confirmLabel={labels.confirmClearAllConfirm}
        cancelLabel={labels.confirmRemoveCancel}
      />
    </>
  );
}
