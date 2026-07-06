import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonListFeature } from "../index";
import { getPokemonListInitialData } from "@/app/[lang]/pokemon/utils/getPokemonListInitialData";
import { prefetchPokemonSpecies } from "@/lib/api/prefetchPokemonSpecies";

jest.mock("@/app/[lang]/pokemon/utils/getPokemonListInitialData", () => ({
  getPokemonListInitialData: jest.fn(),
}));
jest.mock("@/lib/api/prefetchPokemonSpecies", () => ({
  prefetchPokemonSpecies: jest.fn(),
}));
jest.mock("../PokemonList", () => ({
  PokemonList: () => <div data-testid="pokemon-list" />,
}));

const getPokemonListInitialDataMock = getPokemonListInitialData as jest.Mock;
const prefetchPokemonSpeciesMock = prefetchPokemonSpecies as jest.Mock;

const initialData = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
  ],
};

async function renderFeature(searchParams: Record<string, string> = {}) {
  const ui = await PokemonListFeature({ searchParams });
  render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
}

describe("PokemonListFeature (server wrapper)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPokemonListInitialDataMock.mockResolvedValue({
      initialData,
      visibleNames: ["bulbasaur", "charmander"],
    });
    prefetchPokemonSpeciesMock.mockResolvedValue(undefined);
  });

  it("prefetches initial data and species, then renders the client list", async () => {
    await renderFeature();
    expect(getPokemonListInitialDataMock).toHaveBeenCalled();
    expect(prefetchPokemonSpeciesMock).toHaveBeenCalledWith(
      expect.any(QueryClient),
      ["bulbasaur", "charmander"],
    );
    expect(screen.getByTestId("pokemon-list")).toBeInTheDocument();
  });

  it("skips species prefetch when there are no visible names", async () => {
    getPokemonListInitialDataMock.mockResolvedValue({
      initialData: { count: 0, next: null, previous: null, results: [] },
      visibleNames: [],
    });
    await renderFeature({ types: "electric,fire" });
    expect(prefetchPokemonSpeciesMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("pokemon-list")).toBeInTheDocument();
  });
});
