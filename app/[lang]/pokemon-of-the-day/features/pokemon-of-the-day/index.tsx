"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS } from "@/lib/constants";
import { FavoriteButton } from "@/components/FavoriteButton";
import { usePokemonOfTheDayStore } from "@/store/pokemon-of-the-day";
import { PokemonOfTheDayCardSkeleton } from "./PokemonOfTheDaySkeleton";
import type { Locale } from "@/lib/constants";

interface PokemonOfTheDayLabels {
  mystery: string;
  mysteryType: string;
  viewDetails: string;
  reveal: string;
  height: string;
  weight: string;
  heightUnit: string;
  weightUnit: string;
  addFavorite: string;
  removeFavorite: string;
}

export interface PokemonOfTheDayData {
  id: number;
  name: string;
  localizedName: string;
  sprite: string;
  types: { slug: string; label: string }[];
  height: number;
  weight: number;
}

interface Props {
  pokemon: PokemonOfTheDayData;
  /** UTC day key of the server pick; a stored reveal only counts if it matches. */
  dayKey: string;
  labels: PokemonOfTheDayLabels;
  locale: Locale;
}

export function PokemonOfTheDayClient({ pokemon, dayKey, labels, locale }: Props) {
  const revealedDayKey = usePokemonOfTheDayStore((s) => s.revealedDayKey);
  const hydrated = usePokemonOfTheDayStore((s) => s.hydrated);
  const revealDay = usePokemonOfTheDayStore((s) => s.reveal);

  // The store skips automatic hydration so server and hydration renders match;
  // the persisted reveal is loaded here, after mount.
  useEffect(() => {
    void usePokemonOfTheDayStore.persist.rehydrate();
  }, []);

  // Skeleton until the stored reveal has been checked, then either card state.
  if (!hydrated) {
    return <PokemonOfTheDayCardSkeleton />;
  }

  const revealed = revealedDayKey === dayKey;

  return (
    <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 shadow-md w-full max-w-sm">
      {revealed && (
        <div className="absolute top-4 right-4">
          <FavoriteButton
            id={pokemon.id}
            name={pokemon.name}
            addLabel={labels.addFavorite}
            removeLabel={labels.removeFavorite}
          />
        </div>
      )}

      {revealed ? (
        <Image
          src={pokemon.sprite}
          alt={pokemon.name}
          width={160}
          height={160}
          className="object-contain drop-shadow-lg"
          priority
        />
      ) : (
        <div className="h-40 w-40 flex items-center justify-center rounded-2xl bg-muted text-6xl font-black text-muted-foreground select-none">
          ?
        </div>
      )}

      <h2 className="text-2xl font-bold">
        {revealed ? pokemon.localizedName : labels.mystery}
      </h2>

      <div className="flex gap-2">
        {revealed ? (
          pokemon.types.map(({ slug, label }) => (
            <span
              key={slug}
              className="rounded-full px-3 py-1 text-xs font-bold uppercase text-white"
              style={{ backgroundColor: TYPE_COLORS[slug] ?? DEFAULT_TYPE_COLOR }}
            >
              {label}
            </span>
          ))
        ) : (
          <span className="rounded-full px-3 py-1 text-xs font-bold uppercase bg-muted text-muted-foreground">
            {labels.mysteryType}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground mt-2">
        <span>{labels.height}</span>
        <span className="text-foreground font-medium">
          {revealed ? `${(pokemon.height / 10).toFixed(1)}${labels.heightUnit}` : "? m"}
        </span>
        <span>{labels.weight}</span>
        <span className="text-foreground font-medium">
          {revealed ? `${(pokemon.weight / 10).toFixed(1)}${labels.weightUnit}` : "? kg"}
        </span>
      </div>

      {revealed ? (
        <Link
          href={`/${locale}/pokemon/${pokemon.name}`}
          className="mt-2 rounded-xl bg-pk-yellow/20 px-5 py-2 text-sm font-semibold text-pk-yellow hover:bg-pk-yellow/30 transition"
        >
          {labels.viewDetails}
        </Link>
      ) : (
        <button
          onClick={() => revealDay(dayKey)}
          className="mt-2 rounded-2xl bg-pk-red px-8 py-3 text-base font-bold text-white shadow-lg transition hover:brightness-110"
        >
          {labels.reveal}
        </button>
      )}
    </div>
  );
}
