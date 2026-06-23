import { fetchPokemonList } from "@/app/api/pokemon";
import { fetchType } from "@/app/api/types";
import { PokemonListClient } from "./PokemonListClient";
import { PAGE_SIZE, type PokemonListInitialData } from "../../hooks/usePokemonListQuery";
import type { PokemonType } from "@/types";

interface Props {
  types: string[];
}

export async function PokemonList({ types }: Props) {
  const [listData, ...typeData] = await Promise.all([
    fetchPokemonList(0, PAGE_SIZE),
    ...types.map(fetchType),
  ]);

  const initialData: PokemonListInitialData = {
    pages: [listData],
    pageParams: [1],
  };

  return (
    <PokemonListClient
      initialData={initialData}
      types={types}
      initialTypeData={typeData as PokemonType[]}
    />
  );
}
