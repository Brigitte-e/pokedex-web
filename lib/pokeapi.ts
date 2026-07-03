import { POKE_SPRITES_BASE_URL } from "@/lib/constants";

export function getPokemonSprite(nameOrId: string | number): string {
  const id = typeof nameOrId === "number" ? nameOrId : parseInt(nameOrId, 10);
  const segment = !isNaN(id) ? id : nameOrId;
  return `${POKE_SPRITES_BASE_URL}/pokemon/other/official-artwork/${segment}.png`;
}

export function getItemSprite(name: string): string {
  return `${POKE_SPRITES_BASE_URL}/items/${name}.png`;
}

export function getIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}

export function capitalize(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
