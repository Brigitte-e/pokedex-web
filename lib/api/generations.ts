import type { Generation, ListResponse } from "@/types";
import { get } from "./client";

export function fetchGenerationList() {
  return get<ListResponse>(`/generation`);
}

export function fetchGeneration(name: string) {
  return get<Generation>(`/generation/${name}`);
}
