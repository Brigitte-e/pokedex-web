"use client";

import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchType } from "@/lib/api/types";
import { fetchGeneration } from "@/lib/api/generations";
import { computeFilteredPokemon } from "@/app/[lang]/pokemon/utils/computeFilteredPokemon";
import type { ListResponse } from "@/types";

interface PokemonListFilters {
  types: string[];
  generation: string | null;
  page: number;
}

function buildFilteredPage(
  filtered: ListResponse["results"],
  offset: number,
): ListResponse {
  const nextOffset = offset + POKEMON_LIST_PAGE_SIZE;

  return {
    count: filtered.length,
    results: filtered.slice(offset, nextOffset),
    next: nextOffset < filtered.length ? String(nextOffset) : null,
    previous: offset > 0 ? String(offset - POKEMON_LIST_PAGE_SIZE) : null,
  };
}

export function usePokemonListQuery(
  { types, generation, page }: PokemonListFilters,
  initialData?: ListResponse,
) {
  const queryClient = useQueryClient();
  const sortedTypes = [...types].sort();
  const isFiltered = sortedTypes.length > 0 || !!generation;
  const offset = (page - 1) * POKEMON_LIST_PAGE_SIZE;

  return useQuery({
    queryKey: isFiltered
      ? ["pokemon-list", "filtered", sortedTypes, generation, page]
      : ["pokemon-list", page],
    queryFn: async () => {
      if (!isFiltered) {
        return fetchPokemonList(offset, POKEMON_LIST_PAGE_SIZE);
      }

      const typeDataList =
        sortedTypes.length > 0
          ? await queryClient.fetchQuery({
              queryKey: ["types-multi", sortedTypes],
              queryFn: () => Promise.all(sortedTypes.map(fetchType)),
              staleTime: 5 * 60 * 1000,
            })
          : null;

      const generationData = generation
        ? await queryClient.fetchQuery({
            queryKey: ["generation", generation],
            queryFn: () => fetchGeneration(generation),
            staleTime: 5 * 60 * 1000,
          })
        : null;

      const filtered = computeFilteredPokemon(
        sortedTypes,
        generation,
        typeDataList,
        generationData,
      );

      return buildFilteredPage(filtered, offset);
    },
    initialData,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
