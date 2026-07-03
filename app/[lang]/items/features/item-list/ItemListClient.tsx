"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { capitalize, getItemSprite } from "@/lib/pokeapi";
import { getLocalizedName } from "@/lib/locale";
import { Pagination } from "@/components/pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { ItemModal, type ItemModalLabels } from "@/components/ItemModal";
import { LazyImage } from "@/components/LazyImage";
import { DEFAULT_LOCALE, ITEM_LIST_PAGE_SIZE } from "@/lib/constants";
import { usePaginationUrl } from "@/hooks/usePaginationUrl";
import { useItemListQuery } from "@/app/[lang]/items/hooks/useItemListQuery";
import { fetchItem } from "@/lib/api/items";
import type { Locale } from "@/lib/constants";

interface ListLabels {
  previous: string;
  next: string;
  pageOfTotalPattern: string;
  pagination: string;
  loading: string;
  errorDefault: string;
}

interface Props {
  itemModalLabels: ItemModalLabels;
  listLabels: ListLabels;
  locale?: Locale;
}

export function ItemListClient({ itemModalLabels, listLabels, locale = "en" }: Props) {
  const [page, setPage] = usePaginationUrl();
  const [openItem, setOpenItem] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useItemListQuery({ page });

  const slugs = data?.results.map((i) => i.name) ?? [];

  // Item details are only fetched for localized display names; for the default
  // locale the capitalized slug suffices and the modal fetches on demand.
  const needsLocalization = locale !== DEFAULT_LOCALE;
  const itemQueries = useQueries({
    queries: needsLocalization
      ? slugs.map((name) => ({
          queryKey: ["item", name],
          queryFn: () => fetchItem(name),
          staleTime: Infinity,
        }))
      : [],
  });

  const totalPages = data ? Math.ceil(data.count / ITEM_LIST_PAGE_SIZE) : 1;

  const paginationLabels = useMemo(
    () => ({
      previous: listLabels.previous,
      next: listLabels.next,
      pageOfTotal: (pg: number, total: number) =>
        listLabels.pageOfTotalPattern
          .replace("{page}", String(pg))
          .replace("{total}", String(total)),
      pagination: listLabels.pagination,
    }),
    [listLabels],
  );

  function getDisplayName(slug: string, index: number) {
    const itemData = needsLocalization ? itemQueries[index]?.data : undefined;
    if (itemData) return getLocalizedName(itemData.names, locale, capitalize(slug));
    return capitalize(slug);
  }

  return (
    <>
      {openItem && (
        <ItemModal
          itemName={openItem}
          onClose={() => setOpenItem(null)}
          labels={itemModalLabels}
          locale={locale}
        />
      )}

      {isLoading && <LoadingState variant="inline" loadingText={listLabels.loading} />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : listLabels.errorDefault} />
      )}

      {data && (
        <>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {data.results.map((item, index) => (
              <li key={item.name}>
                <button
                  onClick={() => setOpenItem(item.name)}
                  className="w-full text-left rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium hover:border-pk-yellow/40 hover:bg-card/80 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LazyImage
                    src={getItemSprite(item.name)}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  {getDisplayName(item.name, index)}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              hasPrevious={!!data.previous}
              hasNext={!!data.next}
              onPrevious={() => setPage(Math.max(1, page - 1))}
              onNext={() => setPage(page + 1)}
              onPageChange={setPage}
              labels={paginationLabels}
            />
          </div>
        </>
      )}
    </>
  );
}
