"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS } from "@/lib/constants";
import { fetchPokemon, capitalize, getPokemonSprite } from "@/lib/pokeapi";
import { t } from "@/lib/i18n";

interface Props {
  name: string;
  onRemove: () => void;
}

export function PokemonPreview({ name, onRemove }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => fetchPokemon(name),
    staleTime: 5 * 60 * 1000,
  });

  const sprite =
    data?.sprites.other?.["official-artwork"]?.front_default ??
    data?.sprites.front_default ??
    getPokemonSprite(name);

  return (
    <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive text-xs"
        aria-label={t("teamBuilder.remove")}
      >
        ✕
      </button>
      {isLoading && (
        <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
      )}
      {isError && <span className="text-xs text-destructive">{t("teamBuilder.notFound")}</span>}
      {data && (
        <>
          <Image src={sprite ?? getPokemonSprite(name)} alt={name} width={80} height={80} className="object-contain drop-shadow" />
          <span className="text-sm font-semibold">{capitalize(data.name)}</span>
          <div className="flex gap-1">
            {data.types.map(({ type }) => (
              <span
                key={type.name}
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                style={{ backgroundColor: TYPE_COLORS[type.name] ?? DEFAULT_TYPE_COLOR }}
              >
                {type.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
