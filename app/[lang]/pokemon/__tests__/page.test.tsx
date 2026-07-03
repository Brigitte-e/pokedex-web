import { render as rtlRender, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PokemonPage from "../page";

function render(ui: React.ReactElement) {
  return rtlRender(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
}
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchType } from "@/lib/api/types";
import { fetchGeneration } from "@/lib/api/generations";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/lib/api/pokemon", () => ({ fetchPokemonList: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchType: jest.fn() }));
jest.mock("@/lib/api/generations", () => ({ fetchGeneration: jest.fn() }));
jest.mock("../features/pokemon-filters", () => ({
  PokemonFilters: ({
    title,
    selectedTypes,
    selectedGeneration,
  }: {
    title: string;
    selectedTypes: string[];
    selectedGeneration: string | null;
  }) => (
    <div data-testid="filters">
      {title}|types:{selectedTypes.join("+")}|gen:{String(selectedGeneration)}
    </div>
  ),
}));
jest.mock("../features/pokemon-list", () => ({
  PokemonListClient: ({ types, generation }: { types: string[]; generation: string | null }) => (
    <div data-testid="list">
      types:{types.join("+")}|gen:{String(generation)}
    </div>
  ),
}));

const fetchPokemonListMock = fetchPokemonList as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;
const fetchGenerationMock = fetchGeneration as jest.Mock;

function renderPage(searchParams: Record<string, string> = {}) {
  return PokemonPage({
    params: Promise.resolve({ lang: "en" }),
    searchParams: Promise.resolve(searchParams),
  });
}

describe("PokemonPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchPokemonListMock.mockResolvedValue({ count: 0, results: [] });
    fetchTypeMock.mockResolvedValue({ name: "fire", pokemon: [] });
    fetchGenerationMock.mockResolvedValue({ name: "generation-i", pokemon_species: [] });
  });

  it("prefetches the unfiltered list and passes empty filters", async () => {
    render(await renderPage());
    expect(screen.getByTestId("filters")).toHaveTextContent("Pokédex|types:|gen:null");
    expect(screen.getByTestId("list")).toHaveTextContent("types:|gen:null");
    expect(fetchPokemonListMock).toHaveBeenCalled();
    expect(fetchTypeMock).not.toHaveBeenCalled();
  });

  it("parses comma-separated types and skips the unfiltered prefetch", async () => {
    render(await renderPage({ types: "fire,water" }));
    expect(screen.getByTestId("filters")).toHaveTextContent("types:fire+water");
    expect(fetchPokemonListMock).not.toHaveBeenCalled();
    // Called via .map, so index and array ride along as extra args.
    expect(fetchTypeMock.mock.calls.map((c) => c[0])).toEqual(["fire", "water"]);
  });

  it("prefetches the selected generation", async () => {
    render(await renderPage({ generation: "generation-i" }));
    expect(screen.getByTestId("list")).toHaveTextContent("gen:generation-i");
    expect(fetchGenerationMock).toHaveBeenCalledWith("generation-i");
  });
});
