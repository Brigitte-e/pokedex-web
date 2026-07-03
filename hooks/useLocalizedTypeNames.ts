"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchTypeList, fetchType } from "@/lib/api/types";
import { getLocalizedName } from "@/lib/locale";
import { capitalize } from "@/lib/pokeapi";
import { DEFAULT_LOCALE } from "@/lib/constants";
import type { Locale } from "@/lib/constants";

const EXCLUDED_TYPES = new Set(["unknown", "stellar"]);

export function useLocalizedTypeNames(locale: Locale) {
  // For the default locale the capitalized slug already is the display name,
  // so skip the type-list plus per-type requests entirely.
  const needsLocalization = locale !== DEFAULT_LOCALE;

  const { data: list } = useQuery({
    queryKey: ["type-list"],
    queryFn: fetchTypeList,
    staleTime: Infinity,
    enabled: needsLocalization,
  });

  const slugs = useMemo(
    () => list?.results.filter((t) => !EXCLUDED_TYPES.has(t.name)).map((t) => t.name) ?? [],
    [list],
  );

  const typeQueries = useQueries({
    queries: needsLocalization
      ? slugs.map((name) => ({
          queryKey: ["type", name],
          queryFn: () => fetchType(name),
          staleTime: Infinity,
        }))
      : [],
  });

  return useMemo(() => {
    const map = new Map<string, string>();
    slugs.forEach((slug, i) => {
      const data = typeQueries[i]?.data;
      map.set(
        slug,
        data ? getLocalizedName(data.names, locale, capitalize(slug)) : capitalize(slug),
      );
    });
    return map;
  }, [slugs, typeQueries, locale]);
}
