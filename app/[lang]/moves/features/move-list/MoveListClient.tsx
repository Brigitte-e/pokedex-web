"use client";

import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { capitalize } from "@/lib/pokeapi";
import { getLocalizedName } from "@/lib/locale";
import { Pagination } from "@/components/pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { MoveModal } from "@/components/MoveModal";
import { MOVE_LIST_PAGE_SIZE } from "@/lib/constants";
import { usePagination } from "@/hooks/usePagination";
import { useMoveListQuery } from "@/app/[lang]/moves/hooks/useMoveListQuery";
import { fetchMove } from "@/lib/api/moves";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  initialPage: number;
}

const MoveListClient = ({ initialPage }: Props) => {
  const { locale, t } = useTranslation();
  const {
    page,
    effectivePage,
    totalPages,
    goToPrevious,
    goToNext,
    setPage,
    syncCount,
  } = usePagination({ pageSize: MOVE_LIST_PAGE_SIZE, initialPage });
  const [openMove, setOpenMove] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useMoveListQuery({ page });

  useEffect(() => {
    syncCount(data?.count);
  }, [data?.count, syncCount]);

  const slugs = data?.results.map((m) => m.name) ?? [];

  const moveQueries = useQueries({
    queries: slugs.map((name) => ({
      queryKey: ["move", name],
      queryFn: () => fetchMove(name),
      staleTime: Infinity,
    })),
  });

  function getDisplayName(slug: string, index: number) {
    const moveData = moveQueries[index]?.data;
    if (moveData) return getLocalizedName(moveData.names, locale, capitalize(slug));
    return capitalize(slug);
  }

  return (
    <>
      {openMove && (
        <MoveModal
          moveName={openMove}
          onClose={() => setOpenMove(null)}
        />
      )}

      {isLoading && <LoadingState variant="inline" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : t("common.errorDefault")} />
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

export { MoveListClient };
