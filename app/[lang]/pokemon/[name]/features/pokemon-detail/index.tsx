import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchPokemon } from "@/lib/api/pokemon";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { fetchAbility } from "@/lib/api/abilities";
import { fetchType } from "@/lib/api/types";
import { isNotFoundError } from "@/lib/api/client";
import { getLocalizedName } from "@/lib/locale";
import { capitalize } from "@/lib/pokeapi";
import { PokemonDetailBoundary } from "./PokemonDetailBoundary";
import type { Locale } from "@/lib/i18n";
import type { Ability } from "@/types";

interface Props {
  name: string;
  locale: Locale;
}

const PokemonDetailFeature = async ({ name, locale }: Props) => {
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

  const localizedName =
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
    const localizedAbilityName = abilityData
      ? getLocalizedName(abilityData.names, locale, capitalize(ability.name))
      : capitalize(ability.name);
    return { ability: { ...ability, localizedName: localizedAbilityName }, is_hidden, slot };
  });

  const queryClient = new QueryClient();
  queryClient.setQueryData(["pokemon", name], pokemon);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PokemonDetailBoundary
        name={name}
        initialData={pokemon}
        localizedName={localizedName}
        localizedAbilities={localizedAbilities}
        typeNameMap={typeNameMap}
      />
    </HydrationBoundary>
  );
};

export { PokemonDetailFeature };
