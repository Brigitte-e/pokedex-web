import type { NamedResource } from "./common";

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
  moves: NamedResource[];
  pokemon: { pokemon: NamedResource; slot: number }[];
}

export interface Generation {
  id: number;
  name: string;
  pokemon_species: NamedResource[];
}
