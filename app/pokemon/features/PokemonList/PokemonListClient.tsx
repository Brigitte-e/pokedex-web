"use client";

import { useEffect } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import { Pagination } from "@/components/Pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { formatGenerationLabel, t } from "@/lib/i18n";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { usePaginationUrl } from "@/hooks/usePaginationUrl";
import { usePokemonListQuery, type PokemonListInitialData } from "../../hooks/usePokemonListQuery";
import { useTypesMultiQuery, intersectPokemon } from "../../hooks/useTypeFilterQuery";
import { useGenerationQuery, filterByGeneration } from "../../hooks/useGenerationFilterQuery";
import { getIdFromUrl } from "@/lib/pokeapi";
import type { Generation, NamedResource, PokemonType } from "@/types";

interface Props {
  initialData?: PokemonListInitialData;
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
  const [page, setPage] = usePaginationUrl();
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

  const totalPages = list ? Math.ceil(list.count / POKEMON_LIST_PAGE_SIZE) : 1;
  const filteredTotalPages = filteredPokemon
    ? Math.max(1, Math.ceil(filteredPokemon.length / POKEMON_LIST_PAGE_SIZE))
    : 1;
  const paginatedFilteredPokemon = filteredPokemon
    ? filteredPokemon.slice(
        (page - 1) * POKEMON_LIST_PAGE_SIZE,
        page * POKEMON_LIST_PAGE_SIZE,
      )
    : [];

  useEffect(() => {
    if (!isFiltered || filteredPokemon === null) return;
    if (page > filteredTotalPages) {
      setPage(filteredTotalPages);
    }
  }, [isFiltered, filteredPokemon, page, filteredTotalPages, setPage]);

  return (
    <>
      {isLoading && <LoadingState variant="grid" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {isFiltered && filteredPokemon !== null && !isLoading && !isError && (
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
                {paginatedFilteredPokemon.map((p, i) => (
                  <li key={p.name}>
                    <CharacterCard
                      id={getIdFromUrl(p.url)}
                      name={p.name}
                      types={types}
                      fetchPriority={i === 0 && page === 1 ? "high" : undefined}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex justify-center">
                <Pagination
                  page={page}
                  totalPages={filteredTotalPages}
                  hasPrevious={page > 1}
                  hasNext={page < filteredTotalPages}
                  onPrevious={() => setPage(Math.max(1, page - 1))}
                  onNext={() => setPage(page + 1)}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </section>
      )}

      {!isFiltered && list && !listLoading && !listError && (
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
              onPrevious={() => setPage(Math.max(1, page - 1))}
              onNext={() => setPage(page + 1)}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </>
  );
}
