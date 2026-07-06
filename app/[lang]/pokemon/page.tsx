import { Suspense } from "react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
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
      <Suspense fallback={<PageHeader titleKey="pages.pokedex.title" />}>
        <PokemonFiltersFeature />
      </Suspense>
      <PokemonListFeature searchParams={resolvedSearchParams} />
    </PageContainer>
  );
}
