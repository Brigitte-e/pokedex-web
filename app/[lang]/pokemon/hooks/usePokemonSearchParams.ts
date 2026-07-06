"use client";

import { useSearchParams } from "next/navigation";
import { parseTypesParam } from "@/app/[lang]/pokemon/utils/parseTypesParam";

export function usePokemonSearchParams() {
  const searchParams = useSearchParams();
  const typesParam = parseTypesParam(searchParams.get("types") ?? undefined);
  const generationParam = searchParams.get("generation") ?? null;

  return { typesParam, generationParam };
}
