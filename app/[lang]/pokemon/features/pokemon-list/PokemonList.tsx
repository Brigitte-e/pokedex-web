"use client";

import { useEffect } from "react";
import { Pagination } from "@/components/pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { usePokemonListQuery } from "@/app/[lang]/pokemon/hooks/usePokemonListQuery";
import { usePokemonSearchParams } from "@/app/[lang]/pokemon/hooks/usePokemonSearchParams";
import { useLocalizedPokemonNames } from "@/hooks/useLocalizedPokemonNames";
import { useTranslation } from "@/hooks/useTranslation";
import type { ListResponse } from "@/types";
import { PokemonListItem } from "./PokemonListItem";
import { usePagination } from "@/hooks/usePagination";

interface Props {
  initialData?: ListResponse;
  initialPage: number;
}

function getFilterHeading(
  t: (key: string, params?: Record<string, string | number>) => string,
  types: string[],
  generation: string | null,
): string {
  if (types.length === 1 && !generation) return t("pokemonList.withType");
  if (types.length > 1 && !generation) return t("pokemonList.matchingTypes");
  if (types.length === 0 && generation) {
    return t("pokemonList.fromGeneration", { generation });
  }
  return t("pokemonList.matchingFilters");
}

const PokemonList = ({ initialData, initialPage }: Props) => {
  const { locale, t } = useTranslation();
  const { typesParam, generationParam } = usePokemonSearchParams();
  const isFiltered = typesParam.length > 0 || !!generationParam;

  const {
    page,
    effectivePage,
    totalPages,
    goToPrevious,
    goToNext,
    setPage,
    syncCount,
  } = usePagination({
    pageSize: POKEMON_LIST_PAGE_SIZE,
    initialCount: initialData?.count,
    initialPage,
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = usePokemonListQuery(
    { types: typesParam, generation: generationParam, page },
    page === initialPage ? initialData : undefined,
  );

  useEffect(() => {
    syncCount(data?.count);
  }, [data?.count, syncCount]);

  const pokemonNames = useLocalizedPokemonNames(
    data?.results.map((item) => item.name) ?? [],
    locale,
  );

  const heading = isFiltered
    ? getFilterHeading(t, typesParam, generationParam)
    : t("pokemonList.all");

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : t("common.errorDefault")}
      />
    );
  }

  if (isLoading && !data) {
    return <LoadingState variant="inline" />;
  }

  if (!data) return null;

  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
        {heading}
      </h3>

      {!data.results.length ? (
        <p className="text-sm text-muted-foreground">{t("pokemonList.noMatch")}</p>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.results.map((item, index) => (
              <PokemonListItem
                key={item.name}
                item={item}
                index={index}
                displayName={pokemonNames.get(item.name)}
                locale={locale}
                fetchPriority={index === 0 && effectivePage === 1 ? "high" : undefined}
              />
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
    </section>
  );
};

export { PokemonList };
