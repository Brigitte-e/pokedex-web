import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { capitalize, getPokemonSprite, TYPE_COLORS } from "@/lib/pokeapi";

export interface PokemonCardProps {
  id: number;
  name: string;
  types?: string[];
  className?: string;
}

export function CharacterCard({ id, name, types = [], className }: PokemonCardProps) {
  const sprite = getPokemonSprite(id);
  const primaryType = types[0];
  const typeColor = primaryType ? TYPE_COLORS[primaryType] : undefined;

  return (
    <Card
      className={cn(
        "overflow-hidden border-border hover:border-pk-yellow/40 hover:shadow-pk-red/20 hover:shadow-xl transition-all duration-300 group",
        className
      )}
    >
      <Link
        href={`/pokemon/${name}`}
        className="flex flex-col items-center gap-3 p-5 text-center"
      >
        <div className="relative h-24 w-24">
          <img
            src={sprite}
            alt={name}
            className="h-24 w-24 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground tabular-nums">
            #{String(id).padStart(4, "0")}
          </span>
          <span className="text-sm font-semibold text-foreground group-hover:text-pk-yellow transition-colors duration-300">
            {capitalize(name)}
          </span>
          {types.length > 0 && (
            <div className="flex gap-1 mt-1">
              {types.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                  style={{ backgroundColor: TYPE_COLORS[t] ?? "#888" }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}
