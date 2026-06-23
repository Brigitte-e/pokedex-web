"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use, useState } from "react";
import { fetchType, capitalize, TYPE_COLORS } from "@/lib/pokeapi";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { MoveModal } from "@/components/MoveModal";

export default function TypeDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const [openMove, setOpenMove] = useState<string | null>(null);

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
    <>
      {openMove && <MoveModal moveName={openMove} onClose={() => setOpenMove(null)} />}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/types"
          className="inline-flex items-center gap-1 text-sm font-medium text-pk-yellow/60 hover:text-pk-yellow transition-colors mb-8"
        >
          ← Back to Types
        </Link>

        {isLoading && <LoadingState variant="type-detail" />}
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
            </div>

            {/* Damage relations */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
                Damage Relations
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {dmgRelations.map(({ label, items }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground mb-2">{label}</p>
                    {items.length > 0 ? (
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
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Moves */}
            {type.moves.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
                  Moves <span className="text-muted-foreground font-normal">({type.moves.length})</span>
                </h2>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {type.moves.map((move) => (
                    <li key={move.name}>
                      <button
                        onClick={() => setOpenMove(move.name)}
                        className="w-full text-left rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium hover:border-pk-yellow/40 hover:bg-card/80 transition-colors cursor-pointer"
                      >
                        {capitalize(move.name)}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}
