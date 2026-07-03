"use client";

import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPokemonList } from "@/lib/api/pokemon";

interface UsePokemonListQueryOptions {
  page: number;
  enabled?: boolean;
}

export function usePokemonListQuery({ page, enabled = true }: UsePokemonListQueryOptions) {
  const offset = (page - 1) * POKEMON_LIST_PAGE_SIZE;

  return useQuery({
    queryKey: ["pokemon-list", page],
    queryFn: () => fetchPokemonList(offset, POKEMON_LIST_PAGE_SIZE),
    placeholderData: keepPreviousData,
    enabled,
  });
}
