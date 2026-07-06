"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { getLocalizedName } from "@/lib/locale";
import { capitalize } from "@/lib/pokeapi";
import type { Locale } from "@/lib/constants";

export function useLocalizedPokemonNames(names: string[], locale: Locale) {
  const speciesQueries = useQueries({
    queries: names.map((name) => ({
      queryKey: ["pokemon-species", name],
      queryFn: () => fetchPokemonSpecies(name),
      staleTime: Infinity,
    })),
  });

  return useMemo(() => {
    const map = new Map<string, string>();
    names.forEach((name, i) => {
      const query = speciesQueries[i];
      const data = query?.data;
      if (data) {
        map.set(name, getLocalizedName(data.names, locale, capitalize(name)));
        return;
      }

      // Avoid flashing English slugs while species data is still loading.
      if (query?.isPending || query?.isFetching) return;

      map.set(name, capitalize(name));
    });
    return map;
  }, [names, speciesQueries, locale]);
}
