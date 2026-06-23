import type { NamedResource } from "./common";

export interface Item {
  id: number;
  name: string;
  cost: number;
  category: NamedResource;
  effect_entries: { effect: string; short_effect: string; language: NamedResource }[];
  sprites: { default: string | null };
}
