"use client";

import { CharacterCard } from "@/components/CharacterCard";
import { getIdFromUrl } from "@/lib/pokeapi";
import type { Locale } from "@/lib/constants";
import type { NamedResource } from "@/types";

interface Props {
  item: NamedResource;
  index: number;
  displayName?: string;
  locale: Locale;
  fetchPriority?: "high" | "low" | "auto";
}

const PokemonListItem = ({ item, displayName, locale, fetchPriority }: Props) => {
  return (
    <li>
      <CharacterCard
        id={getIdFromUrl(item.url)}
        name={item.name}
        displayName={displayName}
        fetchPriority={fetchPriority}
        locale={locale}
      />
    </li>
  );
};

export { PokemonListItem };
