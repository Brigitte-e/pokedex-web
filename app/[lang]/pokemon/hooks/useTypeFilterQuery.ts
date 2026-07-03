"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTypeList, fetchType } from "@/lib/api/types";

export function useTypeListQuery() {
  return useQuery({
    queryKey: ["type-list"],
    queryFn: fetchTypeList,
    staleTime: 10 * 60 * 1000,
    select: (data) =>
      data.results.filter((t) => t.name !== "unknown" && t.name !== "stellar"),
  });
}

export function useTypesMultiQuery(selectedTypes: string[]) {
  const sorted = [...selectedTypes].sort();

  return useQuery({
    queryKey: ["types-multi", sorted],
    queryFn: () => Promise.all(sorted.map(fetchType)),
    staleTime: 5 * 60 * 1000,
    enabled: selectedTypes.length > 0,
  });
}
