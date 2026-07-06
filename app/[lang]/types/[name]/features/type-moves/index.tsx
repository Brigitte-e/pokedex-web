"use client";

import { useState } from "react";
import { capitalize } from "@/lib/pokeapi";
import { MoveModal } from "@/components/MoveModal";
import { useTranslation } from "@/hooks/useTranslation";
import type { NamedResource } from "@/types";

interface Props {
  moves: NamedResource[];
}

const TypeMoves = ({ moves }: Props) => {
  const { t } = useTranslation();
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  if (moves.length === 0) return null;

  return (
    <>
      {selectedMove && (
        <MoveModal
          moveName={selectedMove}
          onClose={() => setSelectedMove(null)}
        />
      )}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-3">
          {t("typeDetail.moves")}
        </h2>
        <div className="flex flex-wrap gap-2 max-h-50 overflow-y-auto">
          {moves.map((move) => (
            <button
              key={move.name}
              onClick={() => setSelectedMove(move.name)}
              className="rounded-full border border-border px-3 py-1 text-sm font-medium hover:border-pk-yellow/40 hover:bg-card/80 transition-colors cursor-pointer"
            >
              {capitalize(move.name)}
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

export { TypeMoves };
