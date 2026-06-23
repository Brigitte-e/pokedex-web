"use client";

import { MOVE_LIST_PAGE_SIZE } from "@/lib/constants";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMoveList } from "@/app/api/moves";
import type { ListResponse } from "@/types";

export interface MoveListInitialData {
  pages: [ListResponse];
  pageParams: [number];
}

interface UseMoveListQueryOptions {
  page: number;
  initialData?: MoveListInitialData;
}

export function useMoveListQuery({ page, initialData }: UseMoveListQueryOptions) {
  const offset = (page - 1) * MOVE_LIST_PAGE_SIZE;
  const matchedInitialData =
    page === initialData?.pageParams[0] ? initialData?.pages[0] : undefined;

  return useQuery({
    queryKey: ["move-list", page],
    queryFn: () => fetchMoveList(offset, MOVE_LIST_PAGE_SIZE),
    placeholderData: keepPreviousData,
    initialData: matchedInitialData,
    initialDataUpdatedAt: matchedInitialData ? () => Date.now() : undefined,
  });
}
