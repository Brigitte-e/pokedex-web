import type { ListResponse } from "@/types";
import { get } from "./client";

export function fetchAbilityList(offset = 0, limit = 20) {
  return get<ListResponse>(`/ability?offset=${offset}&limit=${limit}`);
}
