"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchTypeList, capitalize, TYPE_COLORS } from "@/lib/pokeapi";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

export default function TypesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["type-list"],
    queryFn: fetchTypeList,
    staleTime: 10 * 60 * 1000,
  });

  const types = data?.results.filter((t) => t.name !== "unknown" && t.name !== "stellar") ?? [];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-pk-yellow mb-2 tracking-tight">Types</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Browse all Pokémon types and their damage relations.
      </p>

      {isLoading && <LoadingState variant="inline" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {data && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {types.map((type) => {
            const color = TYPE_COLORS[type.name] ?? "#888";
            return (
              <li key={type.name}>
                <Link
                  href={`/types/${type.name}`}
                  className="flex items-center justify-center rounded-2xl px-4 py-5 font-bold uppercase tracking-widest text-white text-sm transition-all hover:scale-105 hover:shadow-lg shadow-black/30"
                  style={{ backgroundColor: color }}
                >
                  {capitalize(type.name)}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
