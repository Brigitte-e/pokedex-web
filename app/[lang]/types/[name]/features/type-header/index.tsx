import { DEFAULT_TYPE_COLOR, TYPE_COLORS } from "@/lib/constants";

interface Props {
  name: string;
  localizedName: string;
}

const TypeHeader = ({ name, localizedName }: Props) => {
  const color = TYPE_COLORS[name] ?? DEFAULT_TYPE_COLOR;

  return (
    <div
      className="rounded-2xl p-6 text-white shadow-lg shadow-black/30"
      style={{ backgroundColor: color }}
    >
      <h1 className="text-4xl font-bold uppercase tracking-widest">
        {localizedName}
      </h1>
    </div>
  );
};

export { TypeHeader };
