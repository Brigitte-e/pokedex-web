import { getPokemonListInitialData } from "../getPokemonListInitialData";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/pokemon", () => ({ fetchPokemonList: jest.fn() }));

const fetchPokemonListMock = fetchPokemonList as jest.Mock;

describe("getPokemonListInitialData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches the first page", async () => {
    fetchPokemonListMock.mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
    });

    const { initialData, visibleNames } = await getPokemonListInitialData({});

    expect(fetchPokemonListMock).toHaveBeenCalledWith(0, POKEMON_LIST_PAGE_SIZE);
    expect(initialData.results).toHaveLength(1);
    expect(visibleNames).toEqual(["bulbasaur"]);
  });

  it("fetches the requested page offset", async () => {
    fetchPokemonListMock.mockResolvedValue({
      count: 100,
      next: null,
      previous: "prev",
      results: [{ name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" }],
    });

    await getPokemonListInitialData({ page: "2" });

    expect(fetchPokemonListMock).toHaveBeenCalledWith(
      POKEMON_LIST_PAGE_SIZE,
      POKEMON_LIST_PAGE_SIZE,
    );
  });
});
