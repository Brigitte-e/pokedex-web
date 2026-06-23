import type { ListResponse, PokemonType } from "@/types";
import { get } from "./client";

export function fetchTypeList() {
  return get<ListResponse>(`/type?limit=100`);
}

export function fetchType(name: string) {
  return get<PokemonType>(`/type/${name}`);
}
