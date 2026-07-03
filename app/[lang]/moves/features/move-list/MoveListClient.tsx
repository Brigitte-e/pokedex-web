"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { capitalize } from "@/lib/pokeapi";
import { getLocalizedName } from "@/lib/locale";
import { Pagination } from "@/components/pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { MoveModal, type MoveModalLabels } from "@/components/MoveModal";
import { DEFAULT_LOCALE, MOVE_LIST_PAGE_SIZE } from "@/lib/constants";
import { usePaginationUrl } from "@/hooks/usePaginationUrl";
import { useMoveListQuery } from "@/app/[lang]/moves/hooks/useMoveListQuery";
import { fetchMove } from "@/lib/api/moves";
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
  moveModalLabels: MoveModalLabels;
  listLabels: ListLabels;
  locale?: Locale;
}

export function MoveListClient({ moveModalLabels, listLabels, locale = "en" }: Props) {
  const [page, setPage] = usePaginationUrl();
  const [openMove, setOpenMove] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useMoveListQuery({ page });

  const slugs = data?.results.map((m) => m.name) ?? [];

  // Move details are only fetched for localized display names; for the default
  // locale the capitalized slug suffices and the modal fetches on demand.
  const needsLocalization = locale !== DEFAULT_LOCALE;
  const moveQueries = useQueries({
    queries: needsLocalization
      ? slugs.map((name) => ({
          queryKey: ["move", name],
          queryFn: () => fetchMove(name),
          staleTime: Infinity,
        }))
      : [],
  });

  const totalPages = data ? Math.ceil(data.count / MOVE_LIST_PAGE_SIZE) : 1;

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
    const moveData = needsLocalization ? moveQueries[index]?.data : undefined;
    if (moveData) return getLocalizedName(moveData.names, locale, capitalize(slug));
    return capitalize(slug);
  }

  return (
    <>
      {openMove && (
        <MoveModal
          moveName={openMove}
          onClose={() => setOpenMove(null)}
          labels={moveModalLabels}
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
            {data.results.map((move, index) => (
              <li key={move.name}>
                <button
                  onClick={() => setOpenMove(move.name)}
                  className="w-full text-left rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium hover:border-pk-yellow/40 hover:bg-card/80 transition-colors cursor-pointer"
                >
                  {getDisplayName(move.name, index)}
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
