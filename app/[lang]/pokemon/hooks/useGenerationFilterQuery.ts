"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGenerationList, fetchGeneration } from "@/lib/api/generations";

export function useGenerationListQuery() {
  return useQuery({
    queryKey: ["generation-list"],
    queryFn: fetchGenerationList,
    staleTime: 10 * 60 * 1000,
    select: (data) =>
      [...data.results].sort(
        (a, b) =>
          parseInt(a.url.split("/").at(-2) ?? "0", 10) -
          parseInt(b.url.split("/").at(-2) ?? "0", 10),
      ),
  });
}

export function useGenerationQuery(generation: string | null) {
  return useQuery({
    queryKey: ["generation", generation],
    queryFn: () => fetchGeneration(generation!),
    staleTime: 5 * 60 * 1000,
    enabled: !!generation,
  });
}
