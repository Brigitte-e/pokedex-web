import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { PokemonList } from "./features/PokemonList";
import { PokemonListHeader } from "./features/PokemonList/PokemonListHeader";

export default async function PokemonPage({
  searchParams,
}: {
  searchParams: Promise<{ types?: string | string[] }>;
}) {
  const { types } = await searchParams;
  const selectedTypes = types
    ? (Array.isArray(types) ? types : types.split(",")).filter(Boolean)
    : [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PokemonListHeader selected={selectedTypes} />
      <Suspense fallback={<LoadingState variant="grid" />}>
        <PokemonList types={selectedTypes} />
      </Suspense>
    </main>
  );
}
