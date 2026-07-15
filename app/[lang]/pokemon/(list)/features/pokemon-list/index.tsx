import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchPokemonSpecies } from "@/lib/api/prefetchPokemonSpecies";
import { PokemonListBoundary } from "./PokemonListBoundary";
import { getPokemonListInitialData } from "@/app/[lang]/pokemon/(list)/utils/getPokemonListInitialData";

interface Props {
  searchParams?: RawSearchParams;
}

const PokemonListFeature = async ({ searchParams = {} }: Props) => {
  const queryClient = new QueryClient();
  const { initialData, visibleNames, initialPage } =
    await getPokemonListInitialData(searchParams);

  if (visibleNames.length > 0) {
    await prefetchPokemonSpecies(queryClient, visibleNames);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PokemonListBoundary initialData={initialData} initialPage={initialPage} />
    </HydrationBoundary>
  );
};

export { PokemonListFeature };
