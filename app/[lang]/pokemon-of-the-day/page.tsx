import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { fetchPokemon } from "@/lib/api/pokemon";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { fetchType } from "@/lib/api/types";
import { getLocalizedName } from "@/lib/locale";
import { capitalize, getPokemonSprite } from "@/lib/pokeapi";
import { getDailyPick } from "@/lib/pokemon-of-the-day";
import { PokemonOfTheDayClient } from "./features/pokemon-of-the-day";
import type { Locale } from "@/lib/i18n";

// Re-render hourly so the pick rolls over shortly after UTC midnight.
export const revalidate = 3600;

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PokemonOfTheDayPage({ params }: Props) {
  const { lang } = await params;
  const locale = lang as Locale;

  const { id, dayKey } = getDailyPick();
  const pokemon = await fetchPokemon(id);
  const [speciesResult, ...typeResults] = await Promise.allSettled([
    fetchPokemonSpecies(pokemon.id),
    ...pokemon.types.map(({ type }) => fetchType(type.name)),
  ]);

  const localizedName =
    speciesResult.status === "fulfilled"
      ? getLocalizedName(speciesResult.value.names, locale, capitalize(pokemon.name))
      : capitalize(pokemon.name);

  const types = pokemon.types.map(({ type }, i) => {
    const result = typeResults[i];
    return {
      slug: type.name,
      label:
        result.status === "fulfilled"
          ? getLocalizedName(result.value.names, locale, capitalize(type.name))
          : capitalize(type.name),
    };
  });

  const sprite =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default ??
    getPokemonSprite(pokemon.id);

  return (
    <PageContainer>
      <PageHeader
        titleKey="pages.pokemonOfTheDay.title"
        subtitleKey="pages.pokemonOfTheDay.subtitle"
      />
      <PokemonOfTheDayClient
        pokemon={{
          id: pokemon.id,
          name: pokemon.name,
          localizedName,
          sprite,
          types,
          height: pokemon.height,
          weight: pokemon.weight,
        }}
        dayKey={dayKey}
      />
    </PageContainer>
  );
}
