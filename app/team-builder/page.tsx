"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPokemon, capitalize, TYPE_COLORS, getPokemonSprite } from "@/lib/pokeapi";
import { ErrorState } from "@/components/ErrorState";

const MAX_TEAM = 6;

interface TeamSlot {
  name: string;
}

function PokemonPreview({ name, onRemove }: { name: string; onRemove: () => void }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => fetchPokemon(name),
    staleTime: 5 * 60 * 1000,
  });

  const sprite =
    data?.sprites.other?.["official-artwork"]?.front_default ??
    data?.sprites.front_default ??
    getPokemonSprite(name);

  return (
    <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive text-xs"
        aria-label="Remove"
      >
        ✕
      </button>
      {isLoading && (
        <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
      )}
      {isError && <span className="text-xs text-destructive">Not found</span>}
      {data && (
        <>
          <img src={sprite ?? undefined} alt={name} className="h-20 w-20 object-contain drop-shadow" />
          <span className="text-sm font-semibold">{capitalize(data.name)}</span>
          <div className="flex gap-1">
            {data.types.map(({ type }) => (
              <span
                key={type.name}
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                style={{ backgroundColor: TYPE_COLORS[type.name] ?? "#888" }}
              >
                {type.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function TeamBuilderPage() {
  const [team, setTeam] = useState<TeamSlot[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addPokemon() {
    const name = input.trim().toLowerCase();
    if (!name) return;
    if (team.length >= MAX_TEAM) {
      setError("Your team is full (max 6).");
      return;
    }
    if (team.some((s) => s.name === name)) {
      setError(`${capitalize(name)} is already on your team.`);
      return;
    }
    setError(null);
    setTeam((t) => [...t, { name }]);
    setInput("");
  }

  function remove(name: string) {
    setTeam((t) => t.filter((s) => s.name !== name));
  }

  const empty = MAX_TEAM - team.length;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold text-pk-yellow mb-2 tracking-tight">Team Builder</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Build your team of up to 6 Pokémon.
      </p>

      {/* Add form */}
      <form
        className="flex gap-2 mb-8"
        onSubmit={(e) => {
          e.preventDefault();
          addPokemon();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Pokémon name (e.g. pikachu)"
          className="flex-1 rounded-xl border border-border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pk-yellow/50"
        />
        <button
          type="submit"
          disabled={team.length >= MAX_TEAM}
          className="rounded-xl bg-pk-red px-5 py-2 text-sm font-bold text-white disabled:opacity-40 hover:brightness-110 transition"
        >
          Add
        </button>
      </form>

      {error && <ErrorState message={error} />}

      {/* Team grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {team.map((slot) => (
          <PokemonPreview key={slot.name} name={slot.name} onRemove={() => remove(slot.name)} />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/30 h-36 text-muted-foreground/30 text-4xl"
          >
            ?
          </div>
        ))}
      </div>

      {team.length > 0 && (
        <button
          onClick={() => setTeam([])}
          className="mt-8 text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear team
        </button>
      )}
    </main>
  );
}
