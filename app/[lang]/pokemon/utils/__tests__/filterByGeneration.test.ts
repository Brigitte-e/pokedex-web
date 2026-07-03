import { filterByGeneration } from "../filterByGeneration";
import type { NamedResource } from "@/types";

function resources(...names: string[]): NamedResource[] {
  return names.map((name) => ({
    name,
    url: `https://pokeapi.co/api/v2/pokemon/${name}/`,
  }));
}

describe("filterByGeneration", () => {
  it("keeps only pokemon whose species is in the generation", () => {
    const result = filterByGeneration(
      resources("bulbasaur", "chikorita", "treecko"),
      resources("chikorita", "cyndaquil", "totodile"),
    );
    expect(result.map((p) => p.name)).toEqual(["chikorita"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterByGeneration(resources("bulbasaur"), resources("chikorita"))).toEqual([]);
  });

  it("returns an empty list for empty input", () => {
    expect(filterByGeneration([], resources("chikorita"))).toEqual([]);
  });
});
