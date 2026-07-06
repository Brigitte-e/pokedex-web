"use client";

import { STAT_MAX } from "@/lib/constants";
import { capitalize } from "@/lib/pokeapi";
import { useTranslation } from "@/hooks/useTranslation";
import type { StatEntry } from "@/types";

interface StatBarProps {
  displayName: string;
  value: number;
}

const StatBar = ({ displayName, value }: StatBarProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-muted-foreground uppercase tracking-wide shrink-0">
        {displayName}
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
};

interface Props {
  stats: StatEntry[];
}

const PokemonStats = ({ stats }: Props) => {
  const { t } = useTranslation();
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
        {t("pokemonDetail.baseStats")}
      </h2>
      <div className="flex flex-col gap-3">
        {stats.map(({ stat, base_stat }) => {
          const key = `stats.${stat.name}`;
          const label = t(key);
          return (
          <StatBar
            key={stat.name}
            displayName={label === key ? capitalize(stat.name) : label}
            value={base_stat}
          />
          );
        })}
      </div>
    </section>
  );
};

export { PokemonStats };
