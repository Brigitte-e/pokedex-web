"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPokemon } from "@/app/api/pokemon";
import type { Pokemon } from "@/types";

interface UsePokemonQueryOptions {
  name: string;
  initialData?: Pokemon;
}

export function usePokemonQuery({ name, initialData }: UsePokemonQueryOptions) {
  return useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => fetchPokemon(name),
    staleTime: 5 * 60 * 1000,
    initialData,
  });
}
