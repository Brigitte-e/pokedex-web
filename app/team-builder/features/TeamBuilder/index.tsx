"use client";

import { useState } from "react";
import { capitalize } from "@/lib/pokeapi";
import { ErrorState } from "@/components/ErrorState";
import { PokemonPreview } from "./PokemonPreview";

const MAX_TEAM = 6;

interface TeamSlot {
  name: string;
}

export function TeamBuilder() {
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
    <>
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
    </>
  );
}
