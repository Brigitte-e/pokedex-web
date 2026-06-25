// Validate at server/build time only; on the client these vars are inlined by webpack.
if (typeof window === "undefined") {
  if (!process.env.NEXT_PUBLIC_POKE_API_URL) {
    throw new Error("Missing required env var: NEXT_PUBLIC_POKE_API_URL");
  }
  if (!process.env.NEXT_PUBLIC_POKE_SPRITES_URL) {
    throw new Error("Missing required env var: NEXT_PUBLIC_POKE_SPRITES_URL");
  }
}

export const POKE_API_BASE_URL = process.env.NEXT_PUBLIC_POKE_API_URL as string;
export const POKE_SPRITES_BASE_URL = process.env.NEXT_PUBLIC_POKE_SPRITES_URL as string;
export const API_REVALIDATE_SECONDS = 3600;

export const POKEMON_LIST_PAGE_SIZE = 24;
export const ITEM_LIST_PAGE_SIZE = 28;
export const MOVE_LIST_PAGE_SIZE = 28;
export const TYPE_FILTER_PAGE_SIZE = 10;

export const STAT_MAX = 255;
export const MAX_TEAM_SIZE = 6;

export const FAVORITES_STORAGE_KEY = "pokemon-favorites";

export const DEFAULT_TYPE_COLOR = "#888";
export const GENERATION_PREFIX = "generation-";

export const NAV_LINKS = [
  { href: "/pokemon", labelKey: "nav.pokemon" },
  { href: "/types", labelKey: "nav.types" },
  { href: "/moves", labelKey: "nav.moves" },
  { href: "/items", labelKey: "nav.items" },
  { href: "/team-builder", labelKey: "nav.teamBuilder" },
  { href: "/favorites", labelKey: "nav.favorites" },
] as const;

export const TYPE_DAMAGE_RELATIONS = [
  { labelKey: "typeDetail.strongAgainst", key: "double_damage_to" },
  { labelKey: "typeDetail.weakAgainst", key: "double_damage_from" },
  { labelKey: "typeDetail.notVeryEffective", key: "half_damage_to" },
  { labelKey: "typeDetail.resists", key: "half_damage_from" },
  { labelKey: "typeDetail.noEffectAgainst", key: "no_damage_to" },
  { labelKey: "typeDetail.immuneTo", key: "no_damage_from" },
] as const;

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
