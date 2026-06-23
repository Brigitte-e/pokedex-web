import Link from "next/link";
import { fetchTypeList } from "@/app/api/types";
import { capitalize, TYPE_COLORS } from "@/lib/pokeapi";

export async function TypeGrid() {
  const data = await fetchTypeList();
  const types = data.results.filter((t) => t.name !== "unknown" && t.name !== "stellar");

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {types.map((type) => {
        const color = TYPE_COLORS[type.name] ?? "#888";
        return (
          <li key={type.name}>
            <Link
              href={`/types/${type.name}`}
              className="flex items-center justify-center rounded-2xl px-4 py-5 font-bold uppercase tracking-widest text-white text-sm transition-all hover:scale-105 hover:shadow-lg shadow-black/30"
              style={{ backgroundColor: color }}
            >
              {capitalize(type.name)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
