"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTypeList, fetchType } from "@/app/api/types";
import type { PokemonType, NamedResource } from "@/types";

export function useTypeListQuery() {
  return useQuery({
    queryKey: ["type-list"],
    queryFn: fetchTypeList,
    staleTime: 10 * 60 * 1000,
    select: (data) =>
      data.results.filter((t) => t.name !== "unknown" && t.name !== "stellar"),
  });
}

export function useTypesMultiQuery(selectedTypes: string[], initialData?: PokemonType[]) {
  const sorted = [...selectedTypes].sort();
  const matchedInitialData =
    initialData && initialData.length === sorted.length ? initialData : undefined;

  return useQuery({
    queryKey: ["types-multi", sorted],
    queryFn: () => Promise.all(sorted.map(fetchType)),
    staleTime: 5 * 60 * 1000,
    enabled: selectedTypes.length > 0,
    initialData: matchedInitialData,
    initialDataUpdatedAt: matchedInitialData ? () => Date.now() : undefined,
  });
}

export function intersectPokemon(typeDataList: PokemonType[]): NamedResource[] {
  if (typeDataList.length === 0) return [];
  const [first, ...rest] = typeDataList;
  const otherSets = rest.map(
    (td) => new Set(td.pokemon.map(({ pokemon: p }) => p.name))
  );
  return first.pokemon
    .filter(({ pokemon: p }) => otherSets.every((s) => s.has(p.name)))
    .map(({ pokemon: p }) => p);
}
