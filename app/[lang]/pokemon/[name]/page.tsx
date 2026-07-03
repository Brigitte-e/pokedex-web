import { notFound } from "next/navigation";
import { fetchPokemon } from "@/lib/api/pokemon";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { fetchAbility } from "@/lib/api/abilities";
import { fetchType } from "@/lib/api/types";
import { isNotFoundError } from "@/lib/api/client";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { PokemonHero } from "./features/pokemon-hero";
import { PokemonStats } from "./features/pokemon-stats";
import { PokemonAbilities } from "./features/pokemon-abilities";
import { PokemonMoves } from "./features/pokemon-moves";
import { getDictionary, t } from "@/lib/i18n";
import { getLocalizedName } from "@/lib/locale";
import { capitalize } from "@/lib/pokeapi";
import type { Locale } from "@/lib/i18n";
import type { Ability } from "@/types";

interface Props {
  params: Promise<{ lang: string; name: string }>;
}

export default async function PokemonDetailPage({ params }: Props) {
  const { lang, name } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  let pokemon;
  try {
    pokemon = await fetchPokemon(name);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    throw err;
  }

  const [species, ...restResults] = await Promise.allSettled([
    fetchPokemonSpecies(pokemon.id),
    ...pokemon.abilities.map(({ ability }) => fetchAbility(ability.name)),
    ...pokemon.types.map(({ type }) => fetchType(type.name)),
  ]);

  const abilityResults = restResults.slice(0, pokemon.abilities.length);
  const typeResults = restResults.slice(pokemon.abilities.length);

  const localizedPokemonName =
    species.status === "fulfilled"
      ? getLocalizedName(species.value.names, locale, capitalize(pokemon.name))
      : capitalize(pokemon.name);

  const typeNameMap = Object.fromEntries(
    typeResults.map((result, i) => {
      const slug = pokemon.types[i].type.name;
      if (result.status === "fulfilled") {
        return [slug, getLocalizedName(result.value.names, locale, capitalize(slug))];
      }
      return [slug, capitalize(slug)];
    }),
  );

  const abilityMap = new Map<string, Ability>();
  abilityResults.forEach((result, i) => {
    if (result.status === "fulfilled") {
      abilityMap.set(pokemon.abilities[i].ability.name, result.value);
    }
  });

  const localizedAbilities = pokemon.abilities.map(({ ability, is_hidden, slot }) => {
    const abilityData = abilityMap.get(ability.name);
    const localizedName = abilityData
      ? getLocalizedName(abilityData.names, locale, capitalize(ability.name))
      : capitalize(ability.name);
    return { ability: { ...ability, localizedName }, is_hidden, slot };
  });

  const moveModalLabels = {
    power: t(dict, "moveModal.power"),
    accuracy: t(dict, "moveModal.accuracy"),
    pp: t(dict, "moveModal.pp"),
    noDescription: t(dict, "common.noDescription"),
    errorDefault: t(dict, "common.errorDefault"),
    empty: t(dict, "common.empty"),
    close: t(dict, "common.close"),
    damageClassNames: dict.damageClass,
  };

  return (
    <PageContainer>
      <PageHeader
        backHref={`/${locale}/pokemon`}
        backLabel={t(dict, "pokemonDetail.backToPokedex")}
        title=""
      />
      <div className="flex flex-col gap-6">
        <PokemonHero
          pokemon={pokemon}
          localizedName={localizedPokemonName}
          locale={locale}
          typeNameMap={typeNameMap}
          labels={{
            height: t(dict, "pokemonDetail.height"),
            weight: t(dict, "pokemonDetail.weight"),
            baseXp: t(dict, "pokemonDetail.baseXp"),
            heightUnit: t(dict, "pokemonDetail.heightUnit"),
            weightUnit: t(dict, "pokemonDetail.weightUnit"),
            empty: t(dict, "common.empty"),
            addFavorite: t(dict, "favorites.add"),
            removeFavorite: t(dict, "favorites.remove"),
          }}
        />
        <PokemonStats
          stats={pokemon.stats}
          title={t(dict, "pokemonDetail.baseStats")}
          statNames={dict.stats}
        />
        <PokemonAbilities
          abilities={localizedAbilities}
          title={t(dict, "pokemonDetail.abilities")}
          hiddenLabel={t(dict, "pokemonDetail.hidden")}
        />
        <PokemonMoves
          moves={pokemon.moves}
          title={t(dict, "pokemonDetail.moves", { count: pokemon.moves.length })}
          moveModalLabels={moveModalLabels}
          locale={locale}
        />
      </div>
    </PageContainer>
  );
}
