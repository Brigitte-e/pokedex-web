"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import type { ListResponse } from "@/types";
import { PokemonList } from "./PokemonList";

interface Props {
  initialData?: ListResponse;
  initialPage: number;
}

const PokemonListBoundary = ({ initialData, initialPage }: Props) => (
  <ErrorBoundary fallback={(error) => <ErrorState message={error.message} />}>
    <Suspense fallback={<LoadingState variant="grid" />}>
      <PokemonList initialData={initialData} initialPage={initialPage} />
    </Suspense>
  </ErrorBoundary>
);

export { PokemonListBoundary };
