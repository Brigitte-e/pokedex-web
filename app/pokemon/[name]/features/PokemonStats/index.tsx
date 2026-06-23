import { capitalize } from "@/lib/pokeapi";
import { t } from "@/lib/i18n";
import type { StatEntry } from "@/types";

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

interface Props {
  stats: StatEntry[];
}

export function PokemonStats({ stats }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
        {t("pokemonDetail.baseStats")}
      </h2>
      <div className="flex flex-col gap-3">
        {stats.map(({ stat, base_stat }) => (
          <StatBar key={stat.name} name={stat.name} value={base_stat} />
        ))}
      </div>
    </section>
  );
}
