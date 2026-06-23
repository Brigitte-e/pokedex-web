"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMoveList } from "@/app/api/moves";
import type { ListResponse } from "@/types";

export const PAGE_SIZE = 30;

export interface MoveListInitialData {
  pages: [ListResponse];
  pageParams: [number];
}

interface UseMoveListQueryOptions {
  page: number;
  initialData?: MoveListInitialData;
}

export function useMoveListQuery({ page, initialData }: UseMoveListQueryOptions) {
  const offset = (page - 1) * PAGE_SIZE;

  return useQuery({
    queryKey: ["move-list", page],
    queryFn: () => fetchMoveList(offset, PAGE_SIZE),
    placeholderData: keepPreviousData,
    initialData: page === 1 ? initialData?.pages[0] : undefined,
  });
}
