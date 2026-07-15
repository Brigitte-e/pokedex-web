"use client";

import { usePokemonQuery } from "@/app/[lang]/pokemon/[name]/hooks/usePokemonQuery";
import { PokemonHero } from "../pokemon-hero";
import { PokemonStats } from "../pokemon-stats";
import { PokemonAbilities } from "../pokemon-abilities";
import { PokemonMoves } from "../pokemon-moves";
import type { Pokemon, AbilitySlot } from "@/types";

interface Props {
  name: string;
  initialData: Pokemon;
  localizedName: string;
  localizedAbilities: AbilitySlot[];
  typeNameMap: Record<string, string>;
}

const PokemonDetail = ({
  name,
  initialData,
  localizedName,
  localizedAbilities,
  typeNameMap,
}: Props) => {
  const { data } = usePokemonQuery({ name, initialData });
  const pokemon = data ?? initialData;

  return (
    <div className="flex flex-col gap-6">
      <PokemonHero
        pokemon={pokemon}
        localizedName={localizedName}
        typeNameMap={typeNameMap}
      />
      <PokemonStats stats={pokemon.stats} />
      <PokemonAbilities abilities={localizedAbilities} />
      <PokemonMoves moves={pokemon.moves} />
    </div>
  );
};

export { PokemonDetail };
