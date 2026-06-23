"use client";

import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPokemonList } from "@/app/api/pokemon";
import type { ListResponse } from "@/types";

export interface PokemonListInitialData {
  pages: [ListResponse];
  pageParams: [number];
}

interface UsePokemonListQueryOptions {
  page: number;
  enabled?: boolean;
  initialData?: PokemonListInitialData;
}

export function usePokemonListQuery({ page, enabled = true, initialData }: UsePokemonListQueryOptions) {
  const offset = (page - 1) * POKEMON_LIST_PAGE_SIZE;
  const matchedInitialData =
    page === initialData?.pageParams[0] ? initialData?.pages[0] : undefined;

  return useQuery({
    queryKey: ["pokemon-list", page],
    queryFn: () => fetchPokemonList(offset, POKEMON_LIST_PAGE_SIZE),
    placeholderData: keepPreviousData,
    enabled,
    initialData: matchedInitialData,
    initialDataUpdatedAt: matchedInitialData ? () => Date.now() : undefined,
  });
}
