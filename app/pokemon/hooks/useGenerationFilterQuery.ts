"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGenerationList, fetchGeneration } from "@/app/api/generations";
import type { Generation, NamedResource } from "@/types";

export function useGenerationListQuery() {
  return useQuery({
    queryKey: ["generation-list"],
    queryFn: fetchGenerationList,
    staleTime: 10 * 60 * 1000,
    select: (data) =>
      [...data.results].sort(
        (a, b) => parseInt(a.url.split("/").at(-2)!) - parseInt(b.url.split("/").at(-2)!),
      ),
  });
}

export function useGenerationQuery(generation: string | null, initialData?: Generation) {
  return useQuery({
    queryKey: ["generation", generation],
    queryFn: () => fetchGeneration(generation!),
    staleTime: 5 * 60 * 1000,
    enabled: !!generation,
    initialData,
  });
}

export function filterByGeneration(
  pokemon: NamedResource[],
  species: NamedResource[],
): NamedResource[] {
  const speciesSet = new Set(species.map((s) => s.name));
  return pokemon.filter((p) => speciesSet.has(p.name));
}
