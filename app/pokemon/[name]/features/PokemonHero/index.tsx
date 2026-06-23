import Link from "next/link";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS } from "@/lib/constants";
import { capitalize } from "@/lib/pokeapi";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LazyImage } from "@/components/LazyImage";
import { t } from "@/lib/i18n";
import type { Pokemon } from "@/types";

interface Props {
  pokemon: Pokemon;
}

export function PokemonHero({ pokemon }: Props) {
  const sprite =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default;

  return (
    <div className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30">
      {sprite && (
        <LazyImage
          src={sprite}
          alt={pokemon.name}
          width={160}
          height={160}
          wrapperClassName="h-40 w-40"
          className="object-contain drop-shadow-2xl"
          fetchPriority="high"
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
              style={{ backgroundColor: TYPE_COLORS[type.name] ?? DEFAULT_TYPE_COLOR }}
            >
              {type.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-1">
          <div className="flex flex-col items-center rounded-xl bg-muted px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("pokemonDetail.height")}</span>
            <span className="text-sm font-bold">{(pokemon.height / 10).toFixed(1)}{t("pokemonDetail.heightUnit")}</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-muted px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("pokemonDetail.weight")}</span>
            <span className="text-sm font-bold">{(pokemon.weight / 10).toFixed(1)}{t("pokemonDetail.weightUnit")}</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-muted px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("pokemonDetail.baseXp")}</span>
            <span className="text-sm font-bold">{pokemon.base_experience ?? t("common.empty")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
