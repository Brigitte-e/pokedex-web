"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { parseTypesParam } from "@/app/[lang]/pokemon/utils/parseTypesParam";
import { GenerationFilter } from "./generation-filter";
import { TypeFilter } from "./type-filter";

function buildQueryString(types: string[], generation: string | null): string {
  const params = new URLSearchParams();
  if (types.length > 0) params.set("types", types.join(","));
  if (generation) params.set("generation", generation);
  // Omit page — changing filters resets pagination to the first page.
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

const PokemonFiltersFeature = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTypes = parseTypesParam(searchParams.get("types") ?? undefined);
  const selectedGeneration = searchParams.get("generation") ?? null;

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
      titleKey="pages.pokedex.title"
      rightSlot={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <GenerationFilter
            selected={selectedGeneration}
            onChange={handleGenerationChange}
          />
          <TypeFilter selected={selectedTypes} onChange={handleTypeChange} />
        </div>
      }
    />
  );
};

export { PokemonFiltersFeature };
