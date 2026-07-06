"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FavoriteCard } from "@/components/FavoriteCard";
import { ClearFavoritesButton } from "@/components/ClearFavoritesButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useLocalizedPokemonNames } from "@/hooks/useLocalizedPokemonNames";
import { useAuthStore } from "@/store/auth";
import { useTranslation } from "@/hooks/useTranslation";

const FavoritesList = () => {
  const { locale, t } = useTranslation();
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
    return <p className="text-muted-foreground text-sm">{t("common.loading")}</p>;
  }

  if (favorites.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {t("favorites.empty")}
      </p>
    );
  }

  return (
    <>
      <p className="text-muted-foreground mb-8 text-sm">
        {t("favorites.savedCount", { count: favorites.length })}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {favorites.map((fav) => {
          return (
            <FavoriteCard
              key={fav.id}
              id={Number(fav.id)}
              name={fav.name}
              displayName={pokemonNames.get(fav.name)}
              onRemove={() => remove(fav.id)}
            />
          );
        })}
      </div>

      <ClearFavoritesButton onClear={clear} />
    </>
  );
};

export { FavoritesList };
