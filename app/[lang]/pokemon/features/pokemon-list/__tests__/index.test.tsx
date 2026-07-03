import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonListClient } from "../index";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchType } from "@/lib/api/types";
import { fetchGeneration } from "@/lib/api/generations";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/pokemon", () => ({ fetchPokemonList: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchType: jest.fn(), fetchTypeList: jest.fn() }));
jest.mock("@/lib/api/generations", () => ({ fetchGeneration: jest.fn() }));
jest.mock("@/lib/api/species", () => ({ fetchPokemonSpecies: jest.fn() }));
jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/en/pokemon",
  useSearchParams: () => mockSearchParams,
}));

const fetchPokemonListMock = fetchPokemonList as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;
const fetchGenerationMock = fetchGeneration as jest.Mock;

const labels = {
  noMatch: "No Pokémon match the selected filters.",
  all: "All Pokémon",
  previous: "← Previous",
  next: "Next →",
  pageOfTotalPattern: "{page} / {total}",
  pagination: "Pagination",
  loading: "Loading…",
  errorDefault: "Something went wrong",
  withType: "Pokémon with this type",
  matchingTypes: "Pokémon matching all selected types",
  matchingFilters: "Pokémon matching filters",
  fromGenerationPattern: "Pokémon from {generation}",
  generationPattern: "Generation {suffix}",
  generationPrefix: "generation-",
};

const pokemonUrl = (id: number) => `https://pokeapi.co/api/v2/pokemon/${id}/`;

const listResponse = {
  count: POKEMON_LIST_PAGE_SIZE * 2,
  next: "next-url",
  previous: null,
  results: [
    { name: "bulbasaur", url: pokemonUrl(1) },
    { name: "charmander", url: pokemonUrl(4) },
  ],
};

function renderList(props: Partial<Parameters<typeof PokemonListClient>[0]> = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <PokemonListClient types={[]} generation={null} locale="en" labels={labels} {...props} />
    </QueryClientProvider>,
  );
}

describe("PokemonListClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    window.scrollTo = jest.fn();
    fetchPokemonListMock.mockResolvedValue(listResponse);
  });

  describe("unfiltered", () => {
    it("shows the skeleton grid first", () => {
      fetchPokemonListMock.mockReturnValue(new Promise(() => {}));
      const { container } = render(
        <QueryClientProvider
          client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
        >
          <PokemonListClient types={[]} generation={null} locale="en" labels={labels} />
        </QueryClientProvider>,
      );
      expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    });

    it("renders the full list with cards", async () => {
      renderList();
      expect(await screen.findByText("All Pokémon")).toBeInTheDocument();
      expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("Charmander")).toBeInTheDocument();
    });

    it("renders an error message when the list fails", async () => {
      fetchPokemonListMock.mockRejectedValue(new Error("PokeAPI error 500"));
      renderList();
      expect(await screen.findByText("PokeAPI error 500")).toBeInTheDocument();
    });

    it("paginates through the URL", async () => {
      renderList();
      await screen.findByText("Bulbasaur");
      await userEvent.click(screen.getByRole("button", { name: "Next →" }));
      expect(mockReplace).toHaveBeenCalledWith("/en/pokemon?page=2", { scroll: false });
    });
  });

  describe("filtered by type", () => {
    beforeEach(() => {
      fetchTypeMock.mockResolvedValue({
        name: "electric",
        names: [],
        pokemon: [
          { pokemon: { name: "pikachu", url: pokemonUrl(25) }, slot: 1 },
          { pokemon: { name: "raichu", url: pokemonUrl(26) }, slot: 1 },
        ],
      });
    });

    it("renders only the pokemon of the selected type", async () => {
      renderList({ types: ["electric"] });
      expect(await screen.findByText("Pokémon with this type")).toBeInTheDocument();
      expect(screen.getByText("Pikachu")).toBeInTheDocument();
      expect(fetchPokemonListMock).not.toHaveBeenCalled();
    });

    it("uses the multi-type heading for several types", async () => {
      renderList({ types: ["electric", "fire"] });
      expect(
        await screen.findByText("Pokémon matching all selected types"),
      ).toBeInTheDocument();
    });

    it("shows the no-match message when the intersection is empty", async () => {
      fetchTypeMock.mockImplementation((name: string) =>
        Promise.resolve({
          name,
          names: [],
          pokemon:
            name === "electric"
              ? [{ pokemon: { name: "pikachu", url: pokemonUrl(25) }, slot: 1 }]
              : [{ pokemon: { name: "charmander", url: pokemonUrl(4) }, slot: 1 }],
        }),
      );
      renderList({ types: ["electric", "fire"] });
      expect(
        await screen.findByText("No Pokémon match the selected filters."),
      ).toBeInTheDocument();
    });

    it("renders an error message when the type request fails", async () => {
      fetchTypeMock.mockRejectedValue(new Error("PokeAPI error 404"));
      renderList({ types: ["electric"] });
      expect(await screen.findByText("PokeAPI error 404")).toBeInTheDocument();
    });
  });

  describe("filtered by generation", () => {
    beforeEach(() => {
      fetchGenerationMock.mockResolvedValue({
        name: "generation-i",
        pokemon_species: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
        ],
      });
    });

    it("renders the generation heading and its pokemon", async () => {
      renderList({ generation: "generation-i" });
      expect(await screen.findByText("Pokémon from Generation I")).toBeInTheDocument();
      expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    });

    it("combines type and generation filters", async () => {
      fetchTypeMock.mockResolvedValue({
        name: "grass",
        names: [],
        pokemon: [
          { pokemon: { name: "bulbasaur", url: pokemonUrl(1) }, slot: 1 },
          { pokemon: { name: "sprigatito", url: pokemonUrl(906) }, slot: 1 },
        ],
      });
      renderList({ types: ["grass"], generation: "generation-i" });
      expect(await screen.findByText("Pokémon matching filters")).toBeInTheDocument();
      expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
      expect(screen.queryByText("Sprigatito")).not.toBeInTheDocument();
    });
  });
});
