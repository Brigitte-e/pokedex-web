import { fetchPokemonList } from "@/app/api/pokemon";
import { fetchType } from "@/app/api/types";
import { fetchGeneration } from "@/app/api/generations";
import { PokemonListClient } from "./PokemonListClient";
import { PAGE_SIZE, type PokemonListInitialData } from "../../hooks/usePokemonListQuery";
import type { Generation, PokemonType } from "@/types";

interface Props {
  types: string[];
  generation: string | null;
}

export async function PokemonList({ types, generation }: Props) {
  const [listData, generationData, ...typeData] = await Promise.all([
    fetchPokemonList(0, PAGE_SIZE),
    generation ? fetchGeneration(generation) : Promise.resolve(null),
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
      generation={generation}
      initialTypeData={typeData as PokemonType[]}
      initialGenerationData={generationData ?? undefined}
    />
  );
}
