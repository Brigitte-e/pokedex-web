"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use, useState } from "react";
import { fetchPokemon, capitalize, TYPE_COLORS } from "@/lib/pokeapi";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FadeImage } from "@/components/FadeImage";
import { MoveModal } from "@/components/MoveModal";

const STAT_MAX = 255;

function StatBar({ name, value }: { name: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-muted-foreground uppercase tracking-wide shrink-0">
        {capitalize(name)}
      </span>
      <span className="w-8 text-xs font-bold tabular-nums text-right shrink-0">
        {value}
      </span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-pk-yellow transition-all"
          style={{ width: `${(value / STAT_MAX) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  const { data: pokemon, isLoading, isError, error } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => fetchPokemon(name),
    staleTime: 5 * 60 * 1000,
  });

  const sprite =
    pokemon?.sprites.other?.["official-artwork"]?.front_default ??
    pokemon?.sprites.front_default;

  return (
    <>
    {selectedMove && (
      <MoveModal moveName={selectedMove} onClose={() => setSelectedMove(null)} />
    )}
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/pokemon"
        className="inline-flex items-center gap-1 text-sm font-medium text-pk-yellow/60 hover:text-pk-yellow transition-colors mb-8"
      >
        ← Back to Pokédex
      </Link>

      {isLoading && <LoadingState variant="detail" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {pokemon && (
        <div className="flex flex-col gap-6">
          {/* Hero */}
          <div className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30">
            {sprite && (
              <FadeImage
                src={sprite}
                alt={pokemon.name}
                width={160}
                height={160}
                wrapperClassName="h-40 w-40"
                className="object-contain drop-shadow-2xl"
                unoptimized
              />
            )}
            <div className="flex flex-col gap-3 pt-1 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    #{String(pokemon.id).padStart(4, "0")}
                  </p>
                  <h1 className="text-3xl font-bold text-pk-yellow leading-tight">
                    {capitalize(pokemon.name)}
                  </h1>
                </div>
                <FavoriteButton id={pokemon.id} name={pokemon.name} />
              </div>

              <div className="flex gap-2 flex-wrap">
                {pokemon.types.map(({ type }) => (
                  <Link
                    key={type.name}
                    href={`/types/${type.name}`}
                    className="rounded-full px-3 py-1 text-xs font-bold uppercase text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: TYPE_COLORS[type.name] ?? "#888" }}
                  >
                    {type.name}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-1">
                <div className="flex flex-col items-center rounded-xl bg-muted px-3 py-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Height</span>
                  <span className="text-sm font-bold">{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-muted px-3 py-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Weight</span>
                  <span className="text-sm font-bold">{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-muted px-3 py-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Base XP</span>
                  <span className="text-sm font-bold">{pokemon.base_experience ?? "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
              Base Stats
            </h2>
            <div className="flex flex-col gap-3">
              {pokemon.stats.map(({ stat, base_stat }) => (
                <StatBar key={stat.name} name={stat.name} value={base_stat} />
              ))}
            </div>
          </section>

          {/* Abilities */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-3">
              Abilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <Badge key={ability.name} variant={is_hidden ? "accent" : "secondary"}>
                  {capitalize(ability.name)}
                  {is_hidden && (
                    <span className="ml-1 text-[10px] opacity-70">(hidden)</span>
                  )}
                </Badge>
              ))}
            </div>
          </section>

          {/* Moves */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-3">
              Moves ({pokemon.moves.length})
            </h2>
            <div className="flex flex-wrap gap-2 max-h-50 overflow-y-auto">
              {pokemon.moves.map(({ move }) => (
                <button
                  key={move.name}
                  onClick={() => setSelectedMove(move.name)}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                >
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                    {capitalize(move.name)}
                  </Badge>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

    </main>
    </>
  );
}
