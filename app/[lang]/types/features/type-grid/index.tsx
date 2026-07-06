import Link from "next/link";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS } from "@/lib/constants";
import { getLocalizedName } from "@/lib/locale";
import { capitalize } from "@/lib/pokeapi";
import type { PokemonType } from "@/types";
import type { Locale } from "@/lib/constants";

interface Props {
  types: PokemonType[];
  locale: Locale;
}

const TypeGrid = ({ types, locale }: Props) => {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {types.map((type) => {
        const color = TYPE_COLORS[type.name] ?? DEFAULT_TYPE_COLOR;
        const localizedName = getLocalizedName(type.names, locale, capitalize(type.name));
        return (
          <li key={type.name}>
            <Link
              href={`/${locale}/types/${type.name}`}
              className="flex items-center justify-center rounded-2xl px-4 py-5 font-bold uppercase tracking-widest text-white text-sm transition-all hover:scale-105 hover:shadow-lg shadow-black/30"
              style={{ backgroundColor: color }}
            >
              {localizedName}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export { TypeGrid };
