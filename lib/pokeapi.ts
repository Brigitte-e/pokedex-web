export { fetchPokemonList, fetchPokemon } from "@/app/api/pokemon";
export { fetchTypeList, fetchType } from "@/app/api/types";
export { fetchMoveList, fetchMove } from "@/app/api/moves";
export { fetchItemList, fetchItem } from "@/app/api/items";
export { fetchAbilityList } from "@/app/api/abilities";

export type { NamedResource, ListResponse } from "@/types/common";
export type { Pokemon, PokemonType, PokemonSprites, StatEntry, TypeSlot, AbilitySlot, MoveEntry } from "@/types/pokemon";
export type { Move } from "@/types/move";
export type { Item } from "@/types/item";

export function getPokemonSprite(nameOrId: string | number): string {
  const id = typeof nameOrId === "number" ? nameOrId : parseInt(nameOrId, 10);
  const segment = !isNaN(id) ? id : nameOrId;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${segment}.png`;
}

export function getItemSprite(name: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
}

export function getIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}

export function capitalize(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};
