import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { parsePageParam } from "@/components/pagination/pagination";
import { prefetchPokemonSpecies } from "@/lib/api/prefetchPokemonSpecies";
import { PokemonList } from "./PokemonList";
import { getPokemonListInitialData } from "@/app/[lang]/pokemon/utils/getPokemonListInitialData";
import { parseTypesParam } from "@/app/[lang]/pokemon/utils/parseTypesParam";

interface Props {
  searchParams?: { types?: string | string[]; generation?: string; page?: string };
}

const PokemonListFeature = async ({ searchParams }: Props) => {
  const resolvedSearchParams = searchParams ?? {};
  const initialPage = parsePageParam(resolvedSearchParams.page);
  const types = parseTypesParam(resolvedSearchParams.types);
  const generation = resolvedSearchParams.generation ?? null;
  const sortedTypes = [...types].sort();
  const isFiltered = types.length > 0 || !!generation;

  const queryClient = new QueryClient();
  const { initialData, visibleNames } = await getPokemonListInitialData(
    resolvedSearchParams,
    queryClient,
    initialPage,
  );

  const queryKey = isFiltered
    ? ["pokemon-list", "filtered", sortedTypes, generation, initialPage]
    : ["pokemon-list", initialPage];

  queryClient.setQueryData(queryKey, initialData);

  if (visibleNames.length > 0) {
    await prefetchPokemonSpecies(queryClient, visibleNames);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PokemonList initialData={initialData} initialPage={initialPage} />
    </HydrationBoundary>
  );
};

export { PokemonListFeature };
