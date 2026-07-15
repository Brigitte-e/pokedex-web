"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { PokemonDetail } from "./PokemonDetail";
import type { Pokemon, AbilitySlot } from "@/types";

interface Props {
  name: string;
  initialData: Pokemon;
  localizedName: string;
  localizedAbilities: AbilitySlot[];
  typeNameMap: Record<string, string>;
}

const PokemonDetailBoundary = (props: Props) => (
  <ErrorBoundary fallback={(error) => <ErrorState message={error.message} />}>
    <Suspense fallback={<LoadingState variant="detail" />}>
      <PokemonDetail {...props} />
    </Suspense>
  </ErrorBoundary>
);

export { PokemonDetailBoundary };
