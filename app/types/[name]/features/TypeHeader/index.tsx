import { capitalize, TYPE_COLORS } from "@/lib/pokeapi";

interface Props {
  name: string;
}

export function TypeHeader({ name }: Props) {
  const color = TYPE_COLORS[name] ?? "#888";

  return (
    <div
      className="rounded-2xl p-6 text-white shadow-lg shadow-black/30"
      style={{ backgroundColor: color }}
    >
      <h1 className="text-4xl font-bold uppercase tracking-widest">
        {capitalize(name)}
      </h1>
    </div>
  );
}
