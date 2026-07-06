import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { filterByGeneration } from "@/app/[lang]/pokemon/utils/filterByGeneration";
import { intersectPokemon } from "@/app/[lang]/pokemon/utils/intersectPokemon";
import type { ListResponse, NamedResource, PokemonType } from "@/types";

interface Options {
  isFiltered: boolean;
  initialPage: number;
  types: string[];
  generation: string | null;
  listData: ListResponse | null;
  typeDataList: PokemonType[] | null;
  generationData: { pokemon_species: NamedResource[] } | null;
}

export function getVisiblePokemonNames({
  isFiltered,
  initialPage,
  types,
  generation,
  listData,
  typeDataList,
  generationData,
}: Options): string[] {
  if (!isFiltered && listData) {
    return listData.results.map((pokemon) => pokemon.name);
  }

  let filtered: NamedResource[] | null = null;

  if (types.length > 0 && typeDataList) {
    const intersected = intersectPokemon(typeDataList);
    filtered =
      generation && generationData
        ? filterByGeneration(intersected, generationData.pokemon_species)
        : intersected;
  } else if (generation && generationData) {
    filtered = generationData.pokemon_species;
  }

  if (!filtered) return [];

  const offset = (initialPage - 1) * POKEMON_LIST_PAGE_SIZE;
  return filtered
    .slice(offset, offset + POKEMON_LIST_PAGE_SIZE)
    .map((pokemon) => pokemon.name);
}
