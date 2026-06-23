import type { ListResponse, Pokemon } from "@/types";
import { get } from "./client";

export function fetchPokemonList(offset = 0, limit = 20) {
  return get<ListResponse>(`/pokemon?offset=${offset}&limit=${limit}`);
}

export function fetchPokemon(nameOrId: string | number) {
  return get<Pokemon>(`/pokemon/${nameOrId}`);
}
