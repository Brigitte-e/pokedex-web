"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { fetchMoveList, capitalize } from "@/lib/pokeapi";
import { Pagination } from "@/components/Pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { MoveModal } from "@/components/MoveModal";

const PAGE_SIZE = 30;

export default function MovesPage() {
  const [page, setPage] = useState(1);
  const [openMove, setOpenMove] = useState<string | null>(null);
  const offset = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["move-list", page],
    queryFn: () => fetchMoveList(offset, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

  return (
    <>
    {openMove && (
      <MoveModal moveName={openMove} onClose={() => setOpenMove(null)} />
    )}
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-pk-yellow mb-2 tracking-tight">Moves</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        {data ? `${data.count.toLocaleString()} moves total` : "Loading…"}
      </p>

      {isLoading && <LoadingState variant="inline" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {data && (
        <>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {data.results.map((move) => (
              <li key={move.name}>
                <button
                  onClick={() => setOpenMove(move.name)}
                  className="w-full text-left rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium hover:border-pk-yellow/40 hover:bg-card/80 transition-colors cursor-pointer"
                >
                  {capitalize(move.name)}
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
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
            />
          </div>
        </>
      )}
    </main>
    </>
  );
}
