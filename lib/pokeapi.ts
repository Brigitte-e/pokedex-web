import { POKE_SPRITES_BASE_URL } from "@/lib/constants";

export function getPokemonSprite(id: number): string {
  return `${POKE_SPRITES_BASE_URL}/pokemon/other/official-artwork/${id}.png`;
}

export function getIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}

export function capitalize(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
