import type { QueryClient } from "@tanstack/react-query";
import { fetchPokemonSpecies } from "@/lib/api/species";

export function prefetchPokemonSpecies(queryClient: QueryClient, names: string[]) {
  return Promise.all(
    names.map((name) =>
      queryClient.prefetchQuery({
        queryKey: ["pokemon-species", name],
        queryFn: () => fetchPokemonSpecies(name),
        staleTime: Infinity,
      }),
    ),
  );
}
