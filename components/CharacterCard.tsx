import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LazyImage } from "@/components/LazyImage";
import { cn } from "@/lib/utils/cn";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS } from "@/lib/constants";
import { capitalize, getPokemonSprite } from "@/lib/pokeapi";

export interface PokemonCardProps {
  id: number;
  name: string;
  displayName?: string;
  types?: string[];
  typeNameMap?: Map<string, string>;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
  locale: string;
}

export function CharacterCard({
  id,
  name,
  displayName,
  types = [],
  typeNameMap,
  className,
  fetchPriority,
  locale,
}: PokemonCardProps) {
  const sprite = getPokemonSprite(id);
  const href = `/${locale}/pokemon/${name}`;
  const label = displayName ?? capitalize(name);

  return (
    <Card
      className={cn(
        "border-border hover:border-pk-yellow/40 hover:shadow-pk-red/20 hover:shadow-xl transition-all duration-300 group",
        className
      )}
    >
      <Link
        href={href}
        className="flex flex-col items-center gap-3 p-5 text-center"
      >
        <div className="relative h-24 w-24">
          <LazyImage
            src={sprite}
            alt={label}
            width={96}
            height={96}
            fetchPriority={fetchPriority}
            loading={fetchPriority === "high" ? "eager" : undefined}
            wrapperClassName="h-24 w-24"
            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300 ease-out will-change-transform"
          />
        </div>

        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground tabular-nums">
            #{String(id).padStart(4, "0")}
          </span>
          <span
            className="max-w-full truncate text-sm font-semibold text-foreground group-hover:text-pk-yellow transition-colors duration-300"
            title={label}
          >
            {label}
          </span>
          {types.length > 0 && (
            <div className="flex gap-1 mt-1">
              {types.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                  style={{ backgroundColor: TYPE_COLORS[t] ?? DEFAULT_TYPE_COLOR }}
                >
                  {typeNameMap?.get(t) ?? t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}
