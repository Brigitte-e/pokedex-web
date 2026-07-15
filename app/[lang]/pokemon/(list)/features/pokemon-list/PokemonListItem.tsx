"use client";

import { CharacterCard } from "@/components/CharacterCard";
import { getIdFromUrl } from "@/lib/pokeapi";
import type { NamedResource } from "@/types";

interface Props {
  item: NamedResource;
  displayName?: string;
  fetchPriority?: "high" | "low" | "auto";
}

const PokemonListItem = ({ item, displayName, fetchPriority }: Props) => {
  return (
    <CharacterCard
      id={getIdFromUrl(item.url)}
      name={item.name}
      displayName={displayName}
      fetchPriority={fetchPriority}
    />
  );
};

export { PokemonListItem };
