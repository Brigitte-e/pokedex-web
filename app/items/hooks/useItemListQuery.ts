"use client";

import { ITEM_LIST_PAGE_SIZE } from "@/lib/constants";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchItemList } from "@/app/api/items";
import type { ListResponse } from "@/types";

export interface ItemListInitialData {
  pages: [ListResponse];
  pageParams: [number];
}

interface UseItemListQueryOptions {
  page: number;
  initialData?: ItemListInitialData;
}

export function useItemListQuery({ page, initialData }: UseItemListQueryOptions) {
  const offset = (page - 1) * ITEM_LIST_PAGE_SIZE;
  const matchedInitialData =
    page === initialData?.pageParams[0] ? initialData?.pages[0] : undefined;

  return useQuery({
    queryKey: ["item-list", page],
    queryFn: () => fetchItemList(offset, ITEM_LIST_PAGE_SIZE),
    placeholderData: keepPreviousData,
    initialData: matchedInitialData,
    initialDataUpdatedAt: matchedInitialData ? () => Date.now() : undefined,
  });
}
