const BASE = process.env.NEXT_PUBLIC_POKE_API_URL;

export interface NamedResource {
  name: string;
  url: string;
}

export interface ListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedResource[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    "official-artwork"?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface StatEntry {
  base_stat: number;
  stat: NamedResource;
}

export interface TypeSlot {
  slot: number;
  type: NamedResource;
}

export interface AbilitySlot {
  ability: NamedResource;
  is_hidden: boolean;
  slot: number;
}

export interface MoveEntry {
  move: NamedResource;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: TypeSlot[];
  abilities: AbilitySlot[];
  moves: MoveEntry[];
  stats: StatEntry[];
  species: NamedResource;
}

export interface PokemonType {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: NamedResource[];
    double_damage_to: NamedResource[];
    half_damage_from: NamedResource[];
    half_damage_to: NamedResource[];
    no_damage_from: NamedResource[];
    no_damage_to: NamedResource[];
  };
  pokemon: { pokemon: NamedResource; slot: number }[];
}

export interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  type: NamedResource;
  damage_class: NamedResource;
  effect_entries: { effect: string; short_effect: string; language: NamedResource }[];
}

export interface Item {
  id: number;
  name: string;
  cost: number;
  category: NamedResource;
  effect_entries: { effect: string; short_effect: string; language: NamedResource }[];
  sprites: { default: string | null };
}

async function get<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`PokeAPI error ${res.status}: ${path}`);
  return res.json();
}

export function fetchPokemonList(offset = 0, limit = 20) {
  return get<ListResponse>(`/pokemon?offset=${offset}&limit=${limit}`);
}

export function fetchPokemon(nameOrId: string | number) {
  return get<Pokemon>(`/pokemon/${nameOrId}`);
}

export function fetchTypeList() {
  return get<ListResponse>(`/type?limit=100`);
}

export function fetchType(name: string) {
  return get<PokemonType>(`/type/${name}`);
}

export function fetchMoveList(offset = 0, limit = 20) {
  return get<ListResponse>(`/move?offset=${offset}&limit=${limit}`);
}

export function fetchMove(name: string) {
  return get<Move>(`/move/${name}`);
}

export function fetchItemList(offset = 0, limit = 20) {
  return get<ListResponse>(`/item?offset=${offset}&limit=${limit}`);
}

export function fetchItem(name: string) {
  return get<Item>(`/item/${name}`);
}

export function fetchAbilityList(offset = 0, limit = 20) {
  return get<ListResponse>(`/ability?offset=${offset}&limit=${limit}`);
}

export function getPokemonSprite(nameOrId: string | number): string {
  const id =
    typeof nameOrId === "number"
      ? nameOrId
      : parseInt(nameOrId, 10);
  if (!isNaN(id)) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nameOrId}.png`;
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
