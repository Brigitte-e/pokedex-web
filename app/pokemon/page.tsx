"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import { Pagination } from "@/components/Pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { TypeMultiSelect } from "@/components/TypeMultiSelect";
import {
  fetchPokemonList,
  fetchTypeList,
  fetchType,
  getIdFromUrl,
  type PokemonType,
  type NamedResource,
} from "@/lib/pokeapi";

const PAGE_SIZE = 24;

function intersectPokemon(typeDataList: PokemonType[]): NamedResource[] {
  if (typeDataList.length === 0) return [];
  const [first, ...rest] = typeDataList;
  const otherSets = rest.map(
    (td) => new Set(td.pokemon.map(({ pokemon: p }) => p.name))
  );
  return first.pokemon
    .filter(({ pokemon: p }) => otherSets.every((s) => s.has(p.name)))
    .map(({ pokemon: p }) => p);
}

export default function PokemonPage() {
  const [page, setPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const offset = (page - 1) * PAGE_SIZE;

  const { data: typeList } = useQuery({
    queryKey: ["type-list"],
    queryFn: fetchTypeList,
    staleTime: 10 * 60 * 1000,
  });

  const types =
    typeList?.results.filter(
      (t) => t.name !== "unknown" && t.name !== "stellar"
    ) ?? [];

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = useQuery({
    queryKey: ["pokemon-list", page],
    queryFn: () => fetchPokemonList(offset, PAGE_SIZE),
    placeholderData: keepPreviousData,
    enabled: selectedTypes.length === 0,
  });

  // Single query that fetches all selected types together — no hooks in loops
  const sortedSelected = [...selectedTypes].sort();
  const {
    data: typeDataList,
    isLoading: typeLoading,
    isError: typeError,
    error: typeErr,
  } = useQuery({
    queryKey: ["types-multi", sortedSelected],
    queryFn: () => Promise.all(sortedSelected.map(fetchType)),
    staleTime: 5 * 60 * 1000,
    enabled: selectedTypes.length > 0,
  });

  const isLoading = selectedTypes.length > 0 ? typeLoading : listLoading;
  const isError = selectedTypes.length > 0 ? typeError : listError;
  const error = selectedTypes.length > 0 ? typeErr : listErr;

  const filteredPokemon =
    selectedTypes.length > 0 && typeDataList
      ? intersectPokemon(typeDataList)
      : null;

  const totalPages = list ? Math.ceil(list.count / PAGE_SIZE) : 1;

  function handleTypeChange(newSelected: string[]) {
    setSelectedTypes(newSelected);
    setPage(1);
  }

  const singleTypeData =
    selectedTypes.length === 1 ? typeDataList?.[0] : undefined;



  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-pk-yellow mb-2 tracking-tight">
        Pokédex
      </h1>
      <p className="text-muted-foreground mb-6 text-sm">
        {selectedTypes.length === 0
          ? list
            ? `${list.count.toLocaleString()} Pokémon`
            : "Loading…"
          : filteredPokemon !== null
            ? `${filteredPokemon.length} Pokémon`
            : "Loading…"}
      </p>

      <div className="mb-8">
        <TypeMultiSelect
          types={types}
          selected={selectedTypes}
          onChange={handleTypeChange}
        />
      </div>

      {isLoading && <LoadingState variant="grid" />}
      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : undefined}
        />
      )}

      {/* Single type: pokemon grid */}
      {selectedTypes.length === 1 && singleTypeData && (
        <div className="flex flex-col gap-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
              Pokémon with this type
            </h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {(filteredPokemon ?? []).slice(0, 60).map((p) => (
                <li key={p.name}>
                  <CharacterCard id={getIdFromUrl(p.url)} name={p.name} types={selectedTypes} />
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

      {/* Multiple types: intersection grid */}
      {selectedTypes.length > 1 && filteredPokemon !== null && !typeLoading && (
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
                  <CharacterCard id={getIdFromUrl(p.url)} name={p.name} types={selectedTypes} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Default paginated list */}
      {selectedTypes.length === 0 && list && (
        <>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {list.results.map((p, i) => {
              const id = getIdFromUrl(p.url);
              return (
                <li key={p.name}>
                  <CharacterCard id={id} name={p.name} fetchPriority={i === 0 && page === 1 ? "high" : undefined} />
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
