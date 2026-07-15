"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { fetchPokemonList } from "@/lib/api/pokemon";
import type { ListResponse } from "@/types";

export function usePokemonListQuery(page: number, initialData?: ListResponse) {
  const offset = (page - 1) * POKEMON_LIST_PAGE_SIZE;

  return useSuspenseQuery({
    queryKey: ["pokemon-list", page],
    queryFn: () => fetchPokemonList(offset, POKEMON_LIST_PAGE_SIZE),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}
