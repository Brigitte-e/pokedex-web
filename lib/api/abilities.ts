import type { ListResponse, Ability } from "@/types";
import { get } from "./client";

export function fetchAbilityList(offset = 0, limit = 20) {
  return get<ListResponse>(`/ability?offset=${offset}&limit=${limit}`);
}

export function fetchAbility(name: string) {
  return get<Ability>(`/ability/${name}`);
}
