"use client";

import { MOVE_LIST_PAGE_SIZE } from "@/lib/constants";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMoveList } from "@/lib/api/moves";

interface UseMoveListQueryOptions {
  page: number;
}

export function useMoveListQuery({ page }: UseMoveListQueryOptions) {
  const offset = (page - 1) * MOVE_LIST_PAGE_SIZE;

  return useQuery({
    queryKey: ["move-list", page],
    queryFn: () => fetchMoveList(offset, MOVE_LIST_PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
}
