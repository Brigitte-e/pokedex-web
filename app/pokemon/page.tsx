"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import { Pagination } from "@/components/Pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { fetchPokemonList, fetchPokemon, getIdFromUrl } from "@/lib/pokeapi";

const PAGE_SIZE = 24;

export default function PokemonPage() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * PAGE_SIZE;

  const { data: list, isLoading, isError, error } = useQuery({
    queryKey: ["pokemon-list", page],
    queryFn: () => fetchPokemonList(offset, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const totalPages = list ? Math.ceil(list.count / PAGE_SIZE) : 1;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-pk-yellow mb-2 tracking-tight">
        Pokédex
      </h1>
      <p className="text-muted-foreground mb-8 text-sm">
        {list ? `${list.count.toLocaleString()} Pokémon` : "Loading…"}
      </p>

      {isLoading && <LoadingState variant="grid" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {list && (
        <>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {list.results.map((p) => {
              const id = getIdFromUrl(p.url);
              return (
                <li key={p.name}>
                  <CharacterCard id={id} name={p.name} />
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              hasPrevious={!!list.previous}
              hasNext={!!list.next}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
            />
          </div>
        </>
      )}
    </main>
  );
}
