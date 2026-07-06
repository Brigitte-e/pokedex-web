import { PageContainer } from "@/components/PageContainer";
import { PokemonListFeature } from "./features/pokemon-list";
import { PokemonFiltersFeature } from "./features/pokemon-filters";

export default async function PokemonPage({
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ types?: string | string[]; generation?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <PageContainer>
      <PokemonFiltersFeature />
      <PokemonListFeature searchParams={resolvedSearchParams} />
    </PageContainer>
  );
}
