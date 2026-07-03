import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { PageContainer } from "@/components/PageContainer";
import { parsePageParam } from "@/components/pagination/pagination";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchType } from "@/lib/api/types";
import { fetchGeneration } from "@/lib/api/generations";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { getDictionary, t } from "@/lib/i18n";
import { GENERATION_PREFIX } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import { PokemonListClient } from "./features/pokemon-list";
import { PokemonFilters } from "./features/pokemon-filters";

export default async function PokemonPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ types?: string | string[]; generation?: string; page?: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const { types, generation, page } = await searchParams;
  const selectedTypes = types
    ? (Array.isArray(types) ? types : types.split(",")).filter(Boolean)
    : [];
  const selectedGeneration = generation ?? null;
  const initialPage = parsePageParam(page);
  const isFiltered = selectedTypes.length > 0 || !!selectedGeneration;
  const sortedTypes = [...selectedTypes].sort();
  const offset = (initialPage - 1) * POKEMON_LIST_PAGE_SIZE;

  const queryClient = new QueryClient();

  await Promise.all([
    !isFiltered
      ? queryClient.prefetchQuery({
          queryKey: ["pokemon-list", initialPage],
          queryFn: () => fetchPokemonList(offset, POKEMON_LIST_PAGE_SIZE),
        })
      : Promise.resolve(),
    selectedGeneration
      ? queryClient.prefetchQuery({
          queryKey: ["generation", selectedGeneration],
          queryFn: () => fetchGeneration(selectedGeneration),
        })
      : Promise.resolve(),
    sortedTypes.length > 0
      ? queryClient.prefetchQuery({
          queryKey: ["types-multi", sortedTypes],
          queryFn: () => Promise.all(sortedTypes.map(fetchType)),
        })
      : Promise.resolve(),
  ]);

  const genLabels = {
    filterByGeneration: t(dict, "generationFilter.filterByGeneration"),
    allGenerations: t(dict, "generationFilter.allGenerations"),
    generationPattern: dict.generationFilter.generation,
    generationPrefix: GENERATION_PREFIX,
  };

  const typeLabels = {
    filterByType: t(dict, "typeFilter.filterByType"),
    typesSelectedPattern: dict.typeFilter.typesSelected,
    clearAll: t(dict, "typeFilter.clearAll"),
    searchPlaceholder: t(dict, "typeFilter.searchPlaceholder"),
    noTypesFound: t(dict, "typeFilter.noTypesFound"),
    scrollForMore: t(dict, "typeFilter.scrollForMore"),
    removeTypePattern: dict.typeFilter.removeType,
    clearSearch: t(dict, "typeFilter.clearSearch"),
  };

  const listLabels = {
    noMatch: t(dict, "pokemonList.noMatch"),
    all: t(dict, "pokemonList.all"),
    withType: t(dict, "pokemonList.withType"),
    matchingTypes: t(dict, "pokemonList.matchingTypes"),
    matchingFilters: t(dict, "pokemonList.matchingFilters"),
    fromGenerationPattern: dict.pokemonList.fromGeneration,
    generationPattern: dict.generationFilter.generation,
    generationPrefix: GENERATION_PREFIX,
    previous: t(dict, "common.previous"),
    next: t(dict, "common.next"),
    pageOfTotalPattern: dict.common.pageOfTotal,
    pagination: t(dict, "common.pagination"),
    loading: t(dict, "common.loading"),
    errorDefault: t(dict, "common.errorDefault"),
  };

  return (
    <PageContainer>
      <PokemonFilters
        selectedTypes={selectedTypes}
        selectedGeneration={selectedGeneration}
        title={t(dict, "pages.pokedex.title")}
        genLabels={genLabels}
        typeLabels={typeLabels}
        locale={locale}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PokemonListClient
          types={selectedTypes}
          generation={selectedGeneration}
          locale={locale}
          labels={listLabels}
        />
      </HydrationBoundary>
    </PageContainer>
  );
}
