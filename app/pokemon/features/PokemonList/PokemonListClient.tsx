"use client";

import { useState } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import { Pagination } from "@/components/Pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { formatGenerationLabel, t } from "@/lib/i18n";
import { usePokemonListQuery, PAGE_SIZE, type PokemonListInitialData } from "../../hooks/usePokemonListQuery";
import { useTypesMultiQuery, intersectPokemon } from "../../hooks/useTypeFilterQuery";
import { useGenerationQuery, filterByGeneration } from "../../hooks/useGenerationFilterQuery";
import { getIdFromUrl } from "@/lib/pokeapi";
import type { Generation, NamedResource, PokemonType } from "@/types";

interface Props {
  initialData: PokemonListInitialData;
  types: string[];
  generation: string | null;
  initialTypeData: PokemonType[];
  initialGenerationData?: Generation;
}

function getFilterHeading(types: string[], generation: string | null): string {
  if (types.length === 1 && !generation) return t("pokemonList.withType");
  if (types.length > 1 && !generation) return t("pokemonList.matchingTypes");
  if (types.length === 0 && generation) {
    return t("pokemonList.fromGeneration", { generation: formatGenerationLabel(generation) });
  }
  return t("pokemonList.matchingFilters");
}

export function PokemonListClient({
  initialData,
  types,
  generation,
  initialTypeData = [],
  initialGenerationData,
}: Props) {
  const [page, setPage] = useState(1);
  const isFiltered = types.length > 0 || !!generation;

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = usePokemonListQuery({
    page,
    enabled: !isFiltered,
    initialData,
  });

  const {
    data: typeDataList,
    isLoading: typeLoading,
    isError: typeError,
    error: typeErr,
  } = useTypesMultiQuery(types, initialTypeData);

  const {
    data: generationData,
    isLoading: generationLoading,
    isError: generationError,
    error: generationErr,
  } = useGenerationQuery(generation, initialGenerationData);

  const isLoading =
    (types.length > 0 && typeLoading) ||
    (!!generation && generationLoading) ||
    (!isFiltered && listLoading);

  const isError =
    (types.length > 0 && typeError) ||
    (!!generation && generationError) ||
    (!isFiltered && listError);

  const error = typeErr ?? generationErr ?? listErr;

  let filteredPokemon: NamedResource[] | null = null;

  if (types.length > 0 && typeDataList) {
    filteredPokemon = intersectPokemon(typeDataList);
    if (generation && generationData) {
      filteredPokemon = filterByGeneration(filteredPokemon, generationData.pokemon_species);
    }
  } else if (generation && generationData) {
    filteredPokemon = generationData.pokemon_species;
  }

  const totalPages = list ? Math.ceil(list.count / PAGE_SIZE) : 1;

  return (
    <>
      {isLoading && <LoadingState variant="grid" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {isFiltered && filteredPokemon !== null && !isLoading && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
            {getFilterHeading(types, generation)}
          </h3>
          {filteredPokemon.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("pokemonList.noMatch")}
            </p>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {filteredPokemon.slice(0, 60).map((p) => (
                  <li key={p.name}>
                    <CharacterCard id={getIdFromUrl(p.url)} name={p.name} types={types} />
                  </li>
                ))}
              </ul>
              {filteredPokemon.length > 60 && (
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  {t("pokemonList.moreCount", { count: filteredPokemon.length - 60 })}
                </p>
              )}
            </>
          )}
        </section>
      )}

      {!isFiltered && list && !listLoading && (
        <>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
            {t("pokemonList.all")}
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
