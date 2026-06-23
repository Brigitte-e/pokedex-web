"use client";

import { useState } from "react";
import { capitalize } from "@/lib/pokeapi";
import { Badge } from "@/components/ui/badge";
import { MoveModal } from "@/components/MoveModal";
import { t } from "@/lib/i18n";
import type { MoveEntry } from "@/types";

interface Props {
  moves: MoveEntry[];
}

export function PokemonMoves({ moves }: Props) {
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  return (
    <>
      {selectedMove && (
        <MoveModal moveName={selectedMove} onClose={() => setSelectedMove(null)} />
      )}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-3">
          {t("pokemonDetail.moves", { count: moves.length })}
        </h2>
        <div className="flex flex-wrap gap-2 max-h-50 overflow-y-auto">
          {moves.map(({ move }) => (
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
    </>
  );
}
