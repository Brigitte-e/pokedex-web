import { filterByGeneration } from "@/app/[lang]/pokemon/utils/filterByGeneration";
import { intersectPokemon } from "@/app/[lang]/pokemon/utils/intersectPokemon";
import type { NamedResource, PokemonType } from "@/types";

export function computeFilteredPokemon(
  types: string[],
  generation: string | null,
  typeDataList: PokemonType[] | null,
  generationData: { pokemon_species: NamedResource[] } | null,
): NamedResource[] {
  if (types.length > 0 && typeDataList) {
    const intersected = intersectPokemon(typeDataList);
    return generation && generationData
      ? filterByGeneration(intersected, generationData.pokemon_species)
      : intersected;
  }

  if (generation && generationData) {
    return generationData.pokemon_species;
  }

  return [];
}
