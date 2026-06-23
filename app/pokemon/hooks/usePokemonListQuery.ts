"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPokemonList } from "@/app/api/pokemon";
import type { ListResponse } from "@/types";

export const PAGE_SIZE = 24;

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
  const offset = (page - 1) * PAGE_SIZE;

  return useQuery({
    queryKey: ["pokemon-list", page],
    queryFn: () => fetchPokemonList(offset, PAGE_SIZE),
    placeholderData: keepPreviousData,
    enabled,
    initialData: page === 1 ? initialData?.pages[0] : undefined,
  });
}
