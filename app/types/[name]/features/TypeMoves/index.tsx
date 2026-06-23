"use client";

import { useState } from "react";
import { capitalize } from "@/lib/pokeapi";
import { MoveModal } from "@/components/MoveModal";
import type { NamedResource } from "@/types";

interface Props {
  moves: NamedResource[];
}

export function TypeMoves({ moves }: Props) {
  const [openMove, setOpenMove] = useState<string | null>(null);

  if (moves.length === 0) return null;

  return (
    <>
      {openMove && (
        <MoveModal moveName={openMove} onClose={() => setOpenMove(null)} />
      )}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
          Moves <span className="text-muted-foreground font-normal">({moves.length})</span>
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {moves.map((move) => (
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
    </>
  );
}
