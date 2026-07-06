import { QueryClient } from "@tanstack/react-query";
import { prefetchPokemonSpecies } from "../prefetchPokemonSpecies";
import { fetchPokemonSpecies } from "@/lib/api/species";

jest.mock("@/lib/api/species", () => ({ fetchPokemonSpecies: jest.fn() }));

const fetchPokemonSpeciesMock = fetchPokemonSpecies as jest.Mock;

function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

describe("prefetchPokemonSpecies", () => {
  beforeEach(() => jest.clearAllMocks());

  it("prefetches each species into the query cache", async () => {
    fetchPokemonSpeciesMock.mockImplementation((name: string) =>
      Promise.resolve({ name }),
    );
    const queryClient = createQueryClient();
    await prefetchPokemonSpecies(queryClient, ["bulbasaur", "pikachu"]);
    expect(fetchPokemonSpeciesMock.mock.calls.map((c) => c[0])).toEqual([
      "bulbasaur",
      "pikachu",
    ]);
    expect(queryClient.getQueryData(["pokemon-species", "bulbasaur"])).toEqual({
      name: "bulbasaur",
    });
    expect(queryClient.getQueryData(["pokemon-species", "pikachu"])).toEqual({
      name: "pikachu",
    });
  });

  it("does nothing for an empty name list", async () => {
    const queryClient = createQueryClient();
    await prefetchPokemonSpecies(queryClient, []);
    expect(fetchPokemonSpeciesMock).not.toHaveBeenCalled();
  });

  it("skips names already fresh in the cache", async () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(["pokemon-species", "bulbasaur"], { name: "bulbasaur" });
    await prefetchPokemonSpecies(queryClient, ["bulbasaur"]);
    expect(fetchPokemonSpeciesMock).not.toHaveBeenCalled();
  });

  it("resolves even when a species fetch fails", async () => {
    fetchPokemonSpeciesMock.mockRejectedValue(new Error("boom"));
    const queryClient = createQueryClient();
    await expect(
      prefetchPokemonSpecies(queryClient, ["missingno"]),
    ).resolves.toBeDefined();
    expect(queryClient.getQueryData(["pokemon-species", "missingno"])).toBeUndefined();
  });
});
