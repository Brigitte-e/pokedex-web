import { intersectPokemon } from "../intersectPokemon";
import type { PokemonType } from "@/types";

function makeType(names: string[]): PokemonType {
  return {
    pokemon: names.map((name) => ({
      pokemon: { name, url: `https://pokeapi.co/api/v2/pokemon/${name}/` },
    })),
  } as PokemonType;
}

describe("intersectPokemon", () => {
  it("returns an empty list for no types", () => {
    expect(intersectPokemon([])).toEqual([]);
  });

  it("returns all pokemon of a single type", () => {
    const result = intersectPokemon([makeType(["pikachu", "raichu"])]);
    expect(result.map((p) => p.name)).toEqual(["pikachu", "raichu"]);
  });

  it("returns only pokemon present in every type", () => {
    const result = intersectPokemon([
      makeType(["pikachu", "raichu", "magnemite"]),
      makeType(["magnemite", "pikachu"]),
      makeType(["pikachu", "magnemite", "zapdos"]),
    ]);
    expect(result.map((p) => p.name)).toEqual(["pikachu", "magnemite"]);
  });

  it("returns an empty list when no pokemon overlap", () => {
    const result = intersectPokemon([makeType(["pikachu"]), makeType(["charmander"])]);
    expect(result).toEqual([]);
  });
});
