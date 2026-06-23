import type { NamedResource } from "./common";

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
