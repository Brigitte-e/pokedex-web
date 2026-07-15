"use client";

import { useState } from "react";
import { MoveModal } from "@/components/MoveModal";
import { useTranslation } from "@/hooks/useTranslation";
import { MoveBadge } from "./MoveBadge";
import type { MoveEntry } from "@/types";

interface Props {
  moves: MoveEntry[];
}

const PokemonMoves = ({ moves }: Props) => {
  const { t, locale } = useTranslation();
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

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
          {t("pokemonDetail.moves", { count: moves.length })}
        </h2>
        <div className="flex flex-wrap gap-2 max-h-50 overflow-y-auto">
          {moves.map(({ move }) => (
            <MoveBadge key={move.name} name={move.name} locale={locale} onSelect={setSelectedMove} />
          ))}
        </div>
      </section>
    </>
  );
};

export { PokemonMoves };
