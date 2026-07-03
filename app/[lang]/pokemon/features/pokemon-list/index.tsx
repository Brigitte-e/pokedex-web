"use client";

import { useEffect, useMemo } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import { Pagination } from "@/components/pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { usePaginationUrl } from "@/hooks/usePaginationUrl";
import { usePokemonListQuery } from "@/app/[lang]/pokemon/hooks/usePokemonListQuery";
import { useTypesMultiQuery } from "@/app/[lang]/pokemon/hooks/useTypeFilterQuery";
import { useGenerationQuery } from "@/app/[lang]/pokemon/hooks/useGenerationFilterQuery";
import { useLocalizedPokemonNames } from "@/hooks/useLocalizedPokemonNames";
import { useLocalizedTypeNames } from "@/hooks/useLocalizedTypeNames";
import { getIdFromUrl } from "@/lib/pokeapi";
import { intersectPokemon } from "@/app/[lang]/pokemon/utils/intersectPokemon";
import { filterByGeneration } from "@/app/[lang]/pokemon/utils/filterByGeneration";
import type { NamedResource } from "@/types";
import type { Locale } from "@/lib/constants";

interface ListLabels {
  noMatch: string;
  all: string;
  previous: string;
  next: string;
  pageOfTotalPattern: string;
  pagination: string;
  loading: string;
  errorDefault: string;
  withType: string;
  matchingTypes: string;
  matchingFilters: string;
  fromGenerationPattern: string;
  generationPattern: string;
  generationPrefix: string;
}

interface Props {
  types: string[];
  generation: string | null;
  locale: Locale;
  labels: ListLabels;
}

function formatGenLabel(name: string, labels: ListLabels): string {
  const suffix = name.replace(labels.generationPrefix, "").toUpperCase();
  return labels.generationPattern.replace("{suffix}", suffix);
}

function getFilterHeading(labels: ListLabels, types: string[], generation: string | null): string {
  if (types.length === 1 && !generation) return labels.withType;
  if (types.length > 1 && !generation) return labels.matchingTypes;
  if (types.length === 0 && generation) {
    return labels.fromGenerationPattern.replace("{generation}", formatGenLabel(generation, labels));
  }
  return labels.matchingFilters;
}

export function PokemonListClient({ types, generation, locale, labels }: Props) {
  const [page, setPage] = usePaginationUrl();
  const isFiltered = types.length > 0 || !!generation;

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = usePokemonListQuery({ page, enabled: !isFiltered });

  const {
    data: typeDataList,
    isLoading: typeLoading,
    isError: typeError,
    error: typeErr,
  } = useTypesMultiQuery(types);

  const {
    data: generationData,
    isLoading: generationLoading,
    isError: generationError,
    error: generationErr,
  } = useGenerationQuery(generation);

  const isLoading =
    (types.length > 0 && typeLoading) ||
    (!!generation && generationLoading) ||
    (!isFiltered && listLoading);

  const isError =
    (types.length > 0 && typeError) ||
    (!!generation && generationError) ||
    (!isFiltered && listError);

  const error = typeErr ?? generationErr ?? listErr;

  const filteredPokemon = useMemo<NamedResource[] | null>(() => {
    if (types.length > 0 && typeDataList) {
      const intersected = intersectPokemon(typeDataList);
      return generation && generationData
        ? filterByGeneration(intersected, generationData.pokemon_species)
        : intersected;
    }
    if (generation && generationData) {
      return generationData.pokemon_species;
    }
    return null;
  }, [types.length, typeDataList, generation, generationData]);

  const totalPages = list ? Math.ceil(list.count / POKEMON_LIST_PAGE_SIZE) : 1;
  const filteredTotalPages = filteredPokemon
    ? Math.max(1, Math.ceil(filteredPokemon.length / POKEMON_LIST_PAGE_SIZE))
    : 1;
  // Render the clamped page immediately; the effect below only syncs the URL.
  const effectivePage = filteredPokemon ? Math.min(page, filteredTotalPages) : page;
  const paginatedFilteredPokemon = useMemo(
    () =>
      filteredPokemon
        ? filteredPokemon.slice(
            (effectivePage - 1) * POKEMON_LIST_PAGE_SIZE,
            effectivePage * POKEMON_LIST_PAGE_SIZE,
          )
        : [],
    [filteredPokemon, effectivePage],
  );

  const visibleNames = useMemo(() => {
    if (isFiltered && filteredPokemon !== null) {
      return paginatedFilteredPokemon.map((p) => p.name);
    }
    if (!isFiltered && list) {
      return list.results.map((p) => p.name);
    }
    return [];
  }, [isFiltered, filteredPokemon, paginatedFilteredPokemon, list]);

  const pokemonNames = useLocalizedPokemonNames(visibleNames, locale);
  const typeNames = useLocalizedTypeNames(locale);

  useEffect(() => {
    if (!isFiltered || filteredPokemon === null) return;
    if (page > filteredTotalPages) {
      setPage(filteredTotalPages);
    }
  }, [isFiltered, filteredPokemon, page, filteredTotalPages, setPage]);

  const paginationLabels = useMemo(
    () => ({
      previous: labels.previous,
      next: labels.next,
      pageOfTotal: (pg: number, total: number) =>
        labels.pageOfTotalPattern
          .replace("{page}", String(pg))
          .replace("{total}", String(total)),
      pagination: labels.pagination,
    }),
    [labels],
  );

  const heading = getFilterHeading(labels, types, generation);

  return (
    <>
      {isLoading && <LoadingState variant="grid" loadingText={labels.loading} />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : labels.errorDefault} />
      )}

      {isFiltered && filteredPokemon !== null && !isLoading && !isError && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
            {heading}
          </h3>
          {filteredPokemon.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {labels.noMatch}
            </p>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {paginatedFilteredPokemon.map((p, i) => (
                  <li key={p.name}>
                    <CharacterCard
                      id={getIdFromUrl(p.url)}
                      name={p.name}
                      displayName={pokemonNames.get(p.name)}
                      types={types}
                      typeNameMap={typeNames}
                      fetchPriority={i === 0 && effectivePage === 1 ? "high" : undefined}
                      locale={locale}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex justify-center">
                <Pagination
                  page={effectivePage}
                  totalPages={filteredTotalPages}
                  hasPrevious={effectivePage > 1}
                  hasNext={effectivePage < filteredTotalPages}
                  onPrevious={() => setPage(Math.max(1, effectivePage - 1))}
                  onNext={() => setPage(effectivePage + 1)}
                  onPageChange={setPage}
                  labels={paginationLabels}
                />
              </div>
            </>
          )}
        </section>
      )}

      {!isFiltered && list && !listLoading && !listError && (
        <>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
            {labels.all}
          </h3>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {list.results.map((p, i) => {
              const id = getIdFromUrl(p.url);
              return (
                <li key={p.name}>
                  <CharacterCard
                    id={id}
                    name={p.name}
                    displayName={pokemonNames.get(p.name)}
                    fetchPriority={i === 0 && page === 1 ? "high" : undefined}
                    locale={locale}
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
