"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { getLocalizedName } from "@/lib/locale";
import { capitalize } from "@/lib/pokeapi";
import { DEFAULT_LOCALE } from "@/lib/constants";
import type { Locale } from "@/lib/constants";

export function useLocalizedPokemonNames(names: string[], locale: Locale) {
  // For the default locale the capitalized slug already is the display name,
  // so skip the per-pokemon species requests entirely.
  const needsLocalization = locale !== DEFAULT_LOCALE;

  const speciesQueries = useQueries({
    queries: needsLocalization
      ? names.map((name) => ({
          queryKey: ["pokemon-species", name],
          queryFn: () => fetchPokemonSpecies(name),
          staleTime: Infinity,
        }))
      : [],
  });

  return useMemo(() => {
    const map = new Map<string, string>();
    names.forEach((name, i) => {
      const data = needsLocalization ? speciesQueries[i]?.data : undefined;
      map.set(
        name,
        data ? getLocalizedName(data.names, locale, capitalize(name)) : capitalize(name),
      );
    });
    return map;
  }, [names, speciesQueries, locale, needsLocalization]);
}
