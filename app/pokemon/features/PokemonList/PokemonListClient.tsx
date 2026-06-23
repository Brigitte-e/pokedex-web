"use client";

import { useState } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import { Pagination } from "@/components/Pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { usePokemonListQuery, PAGE_SIZE, type PokemonListInitialData } from "../../hooks/usePokemonListQuery";
import { useTypesMultiQuery, intersectPokemon } from "../../hooks/useTypeFilterQuery";
import { getIdFromUrl } from "@/lib/pokeapi";
import type { PokemonType } from "@/types";

interface Props {
  initialData: PokemonListInitialData;
  types: string[];
  initialTypeData: PokemonType[];
}

export function PokemonListClient({ initialData, types, initialTypeData = [] }: Props) {
  const [page, setPage] = useState(1);

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = usePokemonListQuery({
    page,
    enabled: types.length === 0,
    initialData,
  });

  const {
    data: typeDataList,
    isLoading: typeLoading,
    isError: typeError,
    error: typeErr,
  } = useTypesMultiQuery(types, initialTypeData);

  const isLoading = types.length > 0 ? typeLoading : listLoading;
  const isError = types.length > 0 ? typeError : listError;
  const error = types.length > 0 ? typeErr : listErr;

  const filteredPokemon =
    types.length > 0 && typeDataList ? intersectPokemon(typeDataList) : null;

  const totalPages = list ? Math.ceil(list.count / PAGE_SIZE) : 1;

  const singleTypeData = types.length === 1 ? typeDataList?.[0] : undefined;

  return (
    <>
      {isLoading && <LoadingState variant="grid" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {types.length === 1 && singleTypeData && (
        <div className="flex flex-col gap-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
              Pokémon with this type
            </h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {(filteredPokemon ?? []).slice(0, 60).map((p) => (
                <li key={p.name}>
                  <CharacterCard id={getIdFromUrl(p.url)} name={p.name} types={types} />
                </li>
              ))}
            </ul>
            {(filteredPokemon?.length ?? 0) > 60 && (
              <p className="mt-4 text-sm text-muted-foreground text-center">
                + {(filteredPokemon?.length ?? 0) - 60} more Pokémon
              </p>
            )}
          </section>
        </div>
      )}

      {types.length > 1 && filteredPokemon !== null && !typeLoading && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
            Pokémon matching all selected types
          </h3>
          {filteredPokemon.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No Pokémon have all of these types simultaneously.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filteredPokemon.slice(0, 60).map((p) => (
                <li key={p.name}>
                  <CharacterCard id={getIdFromUrl(p.url)} name={p.name} types={types} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {types.length === 0 && list && (
        <>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
            All Pokémon
          </h3>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {list.results.map((p, i) => {
              const id = getIdFromUrl(p.url);
              return (
                <li key={p.name}>
                  <CharacterCard
                    id={id}
                    name={p.name}
                    fetchPriority={i === 0 && page === 1 ? "high" : undefined}
                  />
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
    </>
  );
}
