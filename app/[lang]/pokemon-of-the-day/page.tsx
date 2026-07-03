import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { fetchPokemon } from "@/lib/api/pokemon";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { fetchType } from "@/lib/api/types";
import { getDictionary, t } from "@/lib/i18n";
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
  const dict = await getDictionary(locale);

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

  const labels = {
    mystery: t(dict, "pokemonOfTheDay.mystery"),
    mysteryType: t(dict, "pokemonOfTheDay.mysteryType"),
    viewDetails: t(dict, "pokemonOfTheDay.viewDetails"),
    reveal: t(dict, "pokemonOfTheDay.reveal"),
    height: t(dict, "pokemonDetail.height"),
    weight: t(dict, "pokemonDetail.weight"),
    heightUnit: t(dict, "pokemonDetail.heightUnit"),
    weightUnit: t(dict, "pokemonDetail.weightUnit"),
    addFavorite: t(dict, "favorites.add"),
    removeFavorite: t(dict, "favorites.remove"),
  };

  return (
    <PageContainer>
      <PageHeader
        title={t(dict, "pages.pokemonOfTheDay.title")}
        subtitle={t(dict, "pages.pokemonOfTheDay.subtitle")}
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
        labels={labels}
        locale={locale}
      />
    </PageContainer>
  );
}
