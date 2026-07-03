import type { PokemonSpecies } from "@/types";
import { get } from "./client";

export function fetchPokemonSpecies(nameOrId: string | number) {
  return get<PokemonSpecies>(`/pokemon-species/${nameOrId}`);
}
