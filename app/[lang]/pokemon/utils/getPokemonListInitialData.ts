import type { QueryClient } from "@tanstack/react-query";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchType } from "@/lib/api/types";
import { fetchGeneration } from "@/lib/api/generations";
import { parseTypesParam } from "@/app/[lang]/pokemon/utils/parseTypesParam";
import { computeFilteredPokemon } from "@/app/[lang]/pokemon/utils/computeFilteredPokemon";
import type { ListResponse } from "@/types";

interface SearchParams {
  types?: string | string[];
  generation?: string;
  page?: string;
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

export async function getPokemonListInitialData(
  searchParams: SearchParams,
  queryClient: QueryClient,
  page: number,
): Promise<{ initialData: ListResponse; visibleNames: string[] }> {
  const types = parseTypesParam(searchParams.types);
  const generation = searchParams.generation ?? null;
  const isFiltered = types.length > 0 || !!generation;
  const offset = (page - 1) * POKEMON_LIST_PAGE_SIZE;

  if (!isFiltered) {
    const data = await fetchPokemonList(offset, POKEMON_LIST_PAGE_SIZE);

    return {
      initialData: data,
      visibleNames: data.results.map((pokemon) => pokemon.name),
    };
  }

  const sortedTypes = [...types].sort();

  const [typeDataList, generationData] = await Promise.all([
    sortedTypes.length > 0
      ? Promise.all(sortedTypes.map((type) => fetchType(type))).then((data) => {
          queryClient.setQueryData(["types-multi", sortedTypes], data);
          return data;
        })
      : null,
    generation
      ? fetchGeneration(generation).then((data) => {
          queryClient.setQueryData(["generation", generation], data);
          return data;
        })
      : null,
  ]);

  const filtered = computeFilteredPokemon(types, generation, typeDataList, generationData);
  const pageData = buildFilteredPage(filtered, offset);

  return {
    initialData: pageData,
    visibleNames: pageData.results.map((pokemon) => pokemon.name),
  };
}
