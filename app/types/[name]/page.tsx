"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";
import { fetchType, capitalize, TYPE_COLORS, getIdFromUrl } from "@/lib/pokeapi";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { CharacterCard } from "@/components/CharacterCard";

export default function TypeDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);

  const { data: type, isLoading, isError, error } = useQuery({
    queryKey: ["type", name],
    queryFn: () => fetchType(name),
    staleTime: 5 * 60 * 1000,
  });

  const color = TYPE_COLORS[name] ?? "#888";

  const dmgRelations = type
    ? [
        { label: "Strong against (2×)", items: type.damage_relations.double_damage_to },
        { label: "Weak against (2× from)", items: type.damage_relations.double_damage_from },
        { label: "Not very effective (½×)", items: type.damage_relations.half_damage_to },
        { label: "Resists (½× from)", items: type.damage_relations.half_damage_from },
        { label: "No effect against (0×)", items: type.damage_relations.no_damage_to },
        { label: "Immune to (0× from)", items: type.damage_relations.no_damage_from },
      ]
    : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/types"
        className="inline-flex items-center gap-1 text-sm font-medium text-pk-yellow/60 hover:text-pk-yellow transition-colors mb-8"
      >
        ← Back to Types
      </Link>

      {isLoading && <LoadingState variant="detail" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {type && (
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div
            className="rounded-2xl p-6 text-white shadow-lg shadow-black/30"
            style={{ backgroundColor: color }}
          >
            <h1 className="text-4xl font-bold uppercase tracking-widest">
              {capitalize(type.name)}
            </h1>
            <p className="mt-1 text-white/70 text-sm">
              {type.pokemon.length} Pokémon
            </p>
          </div>

          {/* Damage relations */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
              Damage Relations
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {dmgRelations.map(({ label, items }) =>
                items.length > 0 ? (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground mb-2">{label}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((t) => (
                        <Link
                          key={t.name}
                          href={`/types/${t.name}`}
                          className="rounded-full px-3 py-1 text-xs font-bold uppercase text-white transition-opacity hover:opacity-80"
                          style={{ backgroundColor: TYPE_COLORS[t.name] ?? "#888" }}
                        >
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </section>

          {/* Pokémon of this type */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
              Pokémon with this type
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {type.pokemon.slice(0, 60).map(({ pokemon: p }) => {
                const id = getIdFromUrl(p.url);
                return (
                  <li key={p.name}>
                    <CharacterCard id={id} name={p.name} types={[name]} />
                  </li>
                );
              })}
            </ul>
            {type.pokemon.length > 60 && (
              <p className="mt-4 text-sm text-muted-foreground text-center">
                + {type.pokemon.length - 60} more Pokémon
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
