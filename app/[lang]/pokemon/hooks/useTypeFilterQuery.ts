"use client";

import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchTypeList, fetchType } from "@/lib/api/types";
import { getLocalizedName } from "@/lib/locale";
import { capitalize } from "@/lib/pokeapi";
import type { Locale } from "@/lib/constants";

export function useTypeListQuery() {
  return useQuery({
    queryKey: ["type-list"],
    queryFn: fetchTypeList,
    staleTime: 10 * 60 * 1000,
    select: (data) =>
      data.results.filter((t) => t.name !== "unknown" && t.name !== "stellar"),
  });
}

// Resolves the filterable types together with their localized display names.
// The list endpoint only returns slugs, so each type's detail is fetched to
// read its `names` array. Detail queries share the ["type", name] cache key
// used elsewhere (e.g. MoveModal), so they are mostly served from cache.
export function useTypeFilterOptions(locale: Locale) {
  const { data: types = [], isError } = useTypeListQuery();

  const detailQueries = useQueries({
    queries: types.map((t) => ({
      queryKey: ["type", t.name],
      queryFn: () => fetchType(t.name),
      staleTime: Infinity,
    })),
  });

  const options = useMemo(
    () =>
      types.map((t, i) => {
        const query = detailQueries[i];
        const data = query?.data;

        let displayName: string | undefined;
        if (data) {
          displayName = getLocalizedName(data.names, locale, capitalize(t.name));
        } else if (!query?.isPending && !query?.isFetching) {
          // Settled without data (e.g. the detail request failed): fall back to
          // the slug. While still loading, leave it undefined so no raw slug
          // flashes before the localized name arrives.
          displayName = capitalize(t.name);
        }

        return { name: t.name, displayName };
      }),
    [types, detailQueries, locale],
  );

  return { options, isError };
}

export function useTypesMultiQuery(selectedTypes: string[]) {
  const sorted = [...selectedTypes].sort();

  return useQuery({
    queryKey: ["types-multi", sorted],
    queryFn: () => Promise.all(sorted.map(fetchType)),
    staleTime: 5 * 60 * 1000,
    enabled: selectedTypes.length > 0,
  });
}
