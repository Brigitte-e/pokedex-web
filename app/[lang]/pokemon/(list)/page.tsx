import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { PokemonListFeature } from "./features/pokemon-list";

export default async function PokemonPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <PageContainer>
      <PageHeader titleKey="pages.pokedex.title" />
      <PokemonListFeature searchParams={resolvedSearchParams} />
    </PageContainer>
  );
}
