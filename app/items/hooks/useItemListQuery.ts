"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchItemList } from "@/app/api/items";
import type { ListResponse } from "@/types";

export const PAGE_SIZE = 30;

export interface ItemListInitialData {
  pages: [ListResponse];
  pageParams: [number];
}

interface UseItemListQueryOptions {
  page: number;
  initialData?: ItemListInitialData;
}

export function useItemListQuery({ page, initialData }: UseItemListQueryOptions) {
  const offset = (page - 1) * PAGE_SIZE;

  return useQuery({
    queryKey: ["item-list", page],
    queryFn: () => fetchItemList(offset, PAGE_SIZE),
    placeholderData: keepPreviousData,
    initialData: page === 1 ? initialData?.pages[0] : undefined,
  });
}
