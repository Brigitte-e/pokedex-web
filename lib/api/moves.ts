import type { ListResponse, Move } from "@/types";
import { get } from "./client";

export function fetchMoveList(offset = 0, limit = 20) {
  return get<ListResponse>(`/move?offset=${offset}&limit=${limit}`);
}

export function fetchMove(name: string) {
  return get<Move>(`/move/${name}`);
}
