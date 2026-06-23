"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { TypeFilter } from "../TypeFilter";
import { GenerationFilter } from "../GenerationFilter";
import { PageHeader } from "@/components/PageHeader";

interface Props {
  selectedTypes: string[];
  selectedGeneration: string | null;
}

function buildQueryString(types: string[], generation: string | null): string {
  const params = new URLSearchParams();
  if (types.length > 0) params.set("types", types.join(","));
  if (generation) params.set("generation", generation);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function PokemonListHeader({ selectedTypes, selectedGeneration }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilters = useCallback(
    (types: string[], generation: string | null) => {
      router.replace(`${pathname}${buildQueryString(types, generation)}`, { scroll: false });
    },
    [router, pathname],
  );

  const handleTypeChange = useCallback(
    (types: string[]) => updateFilters(types, selectedGeneration),
    [updateFilters, selectedGeneration],
  );

  const handleGenerationChange = useCallback(
    (generation: string | null) => updateFilters(selectedTypes, generation),
    [updateFilters, selectedTypes],
  );

  return (
    <PageHeader
      title="Pokédex"
      rightSlot={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <GenerationFilter selected={selectedGeneration} onChange={handleGenerationChange} />
          <TypeFilter selected={selectedTypes} onChange={handleTypeChange} />
        </div>
      }
    />
  );
}
