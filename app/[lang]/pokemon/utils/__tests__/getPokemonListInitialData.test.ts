import { QueryClient } from "@tanstack/react-query";
import { getPokemonListInitialData } from "../getPokemonListInitialData";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchType } from "@/lib/api/types";
import { fetchGeneration } from "@/lib/api/generations";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/pokemon", () => ({ fetchPokemonList: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchType: jest.fn() }));
jest.mock("@/lib/api/generations", () => ({ fetchGeneration: jest.fn() }));

const fetchPokemonListMock = fetchPokemonList as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;
const fetchGenerationMock = fetchGeneration as jest.Mock;

describe("getPokemonListInitialData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches the unfiltered first page", async () => {
    fetchPokemonListMock.mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
    });

    const queryClient = new QueryClient();
    const { initialData, visibleNames } = await getPokemonListInitialData({}, queryClient, 1);

    expect(fetchPokemonListMock).toHaveBeenCalledWith(0, POKEMON_LIST_PAGE_SIZE);
    expect(initialData.results).toHaveLength(1);
    expect(visibleNames).toEqual(["bulbasaur"]);
  });

  it("fetches the requested unfiltered page offset", async () => {
    fetchPokemonListMock.mockResolvedValue({
      count: 100,
      next: null,
      previous: "prev",
      results: [{ name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" }],
    });

    const queryClient = new QueryClient();
    await getPokemonListInitialData({ page: "2" }, queryClient, 2);

    expect(fetchPokemonListMock).toHaveBeenCalledWith(
      POKEMON_LIST_PAGE_SIZE,
      POKEMON_LIST_PAGE_SIZE,
    );
  });

  it("builds filtered initial data from type queries", async () => {
    fetchTypeMock.mockImplementation((name: string) =>
      Promise.resolve({
        name,
        pokemon: [{ pokemon: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }, slot: 1 }],
      }),
    );

    const queryClient = new QueryClient();
    const { initialData, visibleNames } = await getPokemonListInitialData(
      { types: "electric" },
      queryClient,
      1,
    );

    expect(fetchPokemonListMock).not.toHaveBeenCalled();
    expect(fetchTypeMock).toHaveBeenCalledWith("electric");
    expect(queryClient.getQueryData(["types-multi", ["electric"]])).toBeTruthy();
    expect(initialData.results[0].name).toBe("pikachu");
    expect(visibleNames).toEqual(["pikachu"]);
  });

  it("builds filtered initial data from generation queries", async () => {
    fetchGenerationMock.mockResolvedValue({
      name: "generation-i",
      pokemon_species: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" }],
    });

    const queryClient = new QueryClient();
    const { visibleNames } = await getPokemonListInitialData(
      { generation: "generation-i" },
      queryClient,
      1,
    );

    expect(fetchGenerationMock).toHaveBeenCalledWith("generation-i");
    expect(queryClient.getQueryData(["generation", "generation-i"])).toBeTruthy();
    expect(visibleNames).toEqual(["bulbasaur"]);
  });
});
