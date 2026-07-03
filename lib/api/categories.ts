import type { ItemCategory } from "@/types";
import { get } from "./client";

export function fetchItemCategory(name: string) {
  return get<ItemCategory>(`/item-category/${name}`);
}
