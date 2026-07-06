"use client";

import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { capitalize } from "@/lib/pokeapi";
import { getLocalizedName } from "@/lib/locale";
import { Pagination } from "@/components/pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { ItemModal } from "@/components/ItemModal";
import { LazyImage } from "@/components/LazyImage";
import { ITEM_LIST_PAGE_SIZE } from "@/lib/constants";
import { usePagination } from "@/hooks/usePagination";
import { useItemListQuery } from "@/app/[lang]/items/hooks/useItemListQuery";
import { fetchItem } from "@/lib/api/items";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  initialPage: number;
}

const ItemListClient = ({ initialPage }: Props) => {
  const { locale, t } = useTranslation();
  const {
    page,
    effectivePage,
    totalPages,
    goToPrevious,
    goToNext,
    setPage,
    syncCount,
  } = usePagination({ pageSize: ITEM_LIST_PAGE_SIZE, initialPage });
  const [openItem, setOpenItem] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useItemListQuery({ page });

  useEffect(() => {
    syncCount(data?.count);
  }, [data?.count, syncCount]);

  const slugs = data?.results.map((i) => i.name) ?? [];

  // Item details provide the real sprite URL (the filename can't be derived
  // from the slug, e.g. tm01 -> tm-normal.png) and localized display names.
  // They share the ["item", name] cache with the modal, so opening it is instant.
  const itemQueries = useQueries({
    queries: slugs.map((name) => ({
      queryKey: ["item", name],
      queryFn: () => fetchItem(name),
      staleTime: Infinity,
    })),
  });

  function getDisplayName(slug: string, index: number) {
    const itemData = itemQueries[index]?.data;
    if (itemData) return getLocalizedName(itemData.names, locale, capitalize(slug));
    return capitalize(slug);
  }

  return (
    <>
      {openItem && (
        <ItemModal
          itemName={openItem}
          onClose={() => setOpenItem(null)}
        />
      )}

      {isLoading && <LoadingState variant="inline" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : t("common.errorDefault")} />
      )}

      {data && (
        <>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {data.results.map((item, index) => {
              const itemData = itemQueries[index]?.data;
              const displayName = getDisplayName(item.name, index);
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setOpenItem(item.name)}
                    className="w-full text-left rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium hover:border-pk-yellow/40 hover:bg-card/80 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {itemData ? (
                      <LazyImage
                        src={itemData.sprites.default}
                        alt={item.name}
                        width={24}
                        height={24}
                        wrapperClassName="h-6 w-6"
                        className="object-contain"
                      />
                    ) : (
                      <span className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-muted" />
                    )}
                    <span className="min-w-0 truncate" title={displayName}>
                      {displayName}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex justify-center">
            <Pagination
              page={effectivePage}
              totalPages={totalPages}
              hasPrevious={!!data.previous}
              hasNext={!!data.next}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </>
  );
};

export { ItemListClient };
