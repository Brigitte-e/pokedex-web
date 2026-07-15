import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { parsePageParam } from "@/lib/utils/parsePageParam";
import type { ListResponse } from "@/types";

export async function getPokemonListInitialData(
  searchParams: RawSearchParams,
): Promise<{ initialData: ListResponse; visibleNames: string[]; initialPage: number }> {
  const { page: initialPage = 1 } = parsePageParam(searchParams);
  const offset = (initialPage - 1) * POKEMON_LIST_PAGE_SIZE;
  const data = await fetchPokemonList(offset, POKEMON_LIST_PAGE_SIZE);

  return {
    initialData: data,
    visibleNames: data.results.map((pokemon) => pokemon.name),
    initialPage,
  };
}
