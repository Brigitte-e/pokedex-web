import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonList } from "../PokemonList";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchType } from "@/lib/api/types";
import { fetchGeneration } from "@/lib/api/generations";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import type { ListResponse } from "@/types";

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

let mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => "/en/pokemon",
  useSearchParams: () => mockSearchParams,
  useParams: () => ({ lang: "en" }),
}));

const fetchPokemonListMock = fetchPokemonList as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;
const fetchGenerationMock = fetchGeneration as jest.Mock;

const pokemonUrl = (id: number) => `https://pokeapi.co/api/v2/pokemon/${id}/`;

const listResponse: ListResponse = {
  count: POKEMON_LIST_PAGE_SIZE * 2,
  next: "next-url",
  previous: null,
  results: [
    { name: "bulbasaur", url: pokemonUrl(1) },
    { name: "charmander", url: pokemonUrl(4) },
  ],
};

function renderList(initial?: ListResponse, initialPage = 1) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <PokemonList initialData={initial} initialPage={initialPage} />
    </QueryClientProvider>,
  );
}

describe("PokemonList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    fetchPokemonListMock.mockResolvedValue(listResponse);
  });

  describe("unfiltered", () => {
    it("renders the full list with cards from initial data", async () => {
      renderList(listResponse);
      expect(await screen.findByText("All Pokémon")).toBeInTheDocument();
      expect(screen.getByAltText("Bulbasaur")).toBeInTheDocument();
      expect(screen.getByAltText("Charmander")).toBeInTheDocument();
    });

    it("renders an error message when the list fails", async () => {
      fetchPokemonListMock.mockRejectedValue(new Error("PokeAPI error 500"));
      renderList();
      expect(await screen.findByText("PokeAPI error 500")).toBeInTheDocument();
    });

    it("renders pagination when more pages are available", async () => {
      renderList(listResponse);
      await screen.findByAltText("Bulbasaur");
      expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Next →" })).toBeEnabled();
    });

    it("fetches the next page when pagination is clicked", async () => {
      const user = userEvent.setup();
      fetchPokemonListMock.mockResolvedValue({
        ...listResponse,
        previous: "prev-url",
        results: [{ name: "squirtle", url: pokemonUrl(7) }],
      });

      renderList(listResponse);
      await screen.findByAltText("Bulbasaur");
      await user.click(screen.getByRole("button", { name: "Next →" }));

      expect(fetchPokemonListMock).toHaveBeenCalledWith(
        POKEMON_LIST_PAGE_SIZE,
        POKEMON_LIST_PAGE_SIZE,
      );
      expect(await screen.findByAltText("Squirtle")).toBeInTheDocument();
    });
  });

  describe("filtered by type", () => {
    beforeEach(() => {
      mockSearchParams = new URLSearchParams("types=electric");
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
      renderList({
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: "pikachu", url: pokemonUrl(25) },
          { name: "raichu", url: pokemonUrl(26) },
        ],
      });
      expect(await screen.findByText("Pokémon with this type")).toBeInTheDocument();
      expect(screen.getByAltText("Pikachu")).toBeInTheDocument();
      expect(fetchPokemonListMock).not.toHaveBeenCalled();
    });

    it("uses the multi-type heading for several types", async () => {
      mockSearchParams = new URLSearchParams("types=electric,fire");
      renderList({ count: 0, next: null, previous: null, results: [] });
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
      mockSearchParams = new URLSearchParams("types=electric,fire");
      renderList({ count: 0, next: null, previous: null, results: [] });
      expect(
        await screen.findByText("No Pokémon match the selected filters."),
      ).toBeInTheDocument();
    });

    it("renders an error message when the type request fails", async () => {
      fetchTypeMock.mockRejectedValue(new Error("PokeAPI error 404"));
      renderList();
      expect(await screen.findByText("PokeAPI error 404")).toBeInTheDocument();
    });
  });

  describe("filtered by generation", () => {
    beforeEach(() => {
      mockSearchParams = new URLSearchParams("generation=generation-i");
      fetchGenerationMock.mockResolvedValue({
        name: "generation-i",
        pokemon_species: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
        ],
      });
    });

    it("renders the generation heading and its pokemon", async () => {
      renderList({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: "bulbasaur", url: pokemonUrl(1) }],
      });
      expect(await screen.findByText("Pokémon from generation-i")).toBeInTheDocument();
      expect(screen.getByAltText("Bulbasaur")).toBeInTheDocument();
    });

    it("combines type and generation filters", async () => {
      mockSearchParams = new URLSearchParams("types=grass&generation=generation-i");
      fetchTypeMock.mockResolvedValue({
        name: "grass",
        names: [],
        pokemon: [
          { pokemon: { name: "bulbasaur", url: pokemonUrl(1) }, slot: 1 },
          { pokemon: { name: "sprigatito", url: pokemonUrl(906) }, slot: 1 },
        ],
      });
      renderList({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: "bulbasaur", url: pokemonUrl(1) }],
      });
      expect(await screen.findByText("Pokémon matching filters")).toBeInTheDocument();
      expect(screen.getByAltText("Bulbasaur")).toBeInTheDocument();
      expect(screen.queryByAltText("Sprigatito")).not.toBeInTheDocument();
    });
  });
});
