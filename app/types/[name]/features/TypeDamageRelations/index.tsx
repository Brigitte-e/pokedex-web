import Link from "next/link";
import { TYPE_COLORS } from "@/lib/pokeapi";
import type { PokemonType, NamedResource } from "@/types";

interface Props {
  type: PokemonType;
}

const RELATIONS = [
  { label: "Strong against (2×)", key: "double_damage_to" },
  { label: "Weak against (2× from)", key: "double_damage_from" },
  { label: "Not very effective (½×)", key: "half_damage_to" },
  { label: "Resists (½× from)", key: "half_damage_from" },
  { label: "No effect against (0×)", key: "no_damage_to" },
  { label: "Immune to (0× from)", key: "no_damage_from" },
] as const;

function TypeBadge({ type }: { type: NamedResource }) {
  return (
    <Link
      href={`/types/${type.name}`}
      className="rounded-full px-3 py-1 text-xs font-bold uppercase text-white transition-opacity hover:opacity-80"
      style={{ backgroundColor: TYPE_COLORS[type.name] ?? "#888" }}
    >
      {type.name}
    </Link>
  );
}

export function TypeDamageRelations({ type }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
        Damage Relations
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {RELATIONS.map(({ label, key }) => {
          const items = type.damage_relations[key];
          return (
            <div key={label}>
              <p className="text-xs text-muted-foreground mb-2">{label}</p>
              {items.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {items.map((t) => (
                    <TypeBadge key={t.name} type={t} />
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
