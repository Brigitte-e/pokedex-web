import type { ListResponse, Item } from "@/types";
import { get } from "./client";

export function fetchItemList(offset = 0, limit = 20) {
  return get<ListResponse>(`/item?offset=${offset}&limit=${limit}`);
}

export function fetchItem(name: string) {
  return get<Item>(`/item/${name}`);
}
