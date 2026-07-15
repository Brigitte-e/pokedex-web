import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonListBoundary } from "../PokemonListBoundary";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import type { ListResponse } from "@/types";

jest.mock("@/lib/api/pokemon", () => ({ fetchPokemonList: jest.fn() }));
jest.mock("@/lib/api/species", () => ({ fetchPokemonSpecies: jest.fn() }));
jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/en/pokemon",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ lang: "en" }),
}));

const fetchPokemonListMock = fetchPokemonList as jest.Mock;
const fetchPokemonSpeciesMock = fetchPokemonSpecies as jest.Mock;

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
      <PokemonListBoundary initialData={initial} initialPage={initialPage} />
    </QueryClientProvider>,
    { onCaughtError: () => {} },
  );
}

describe("PokemonList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
    fetchPokemonListMock.mockResolvedValue(listResponse);
    fetchPokemonSpeciesMock.mockImplementation((name: string) =>
      Promise.resolve({ name, names: [] }),
    );
  });

  it("renders the full list with cards from initial data", async () => {
    renderList(listResponse);
    expect(await screen.findByText("All Pokémon")).toBeInTheDocument();
    expect(screen.getByAltText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByAltText("Charmander")).toBeInTheDocument();
  });

  it("links each card to its detail page with an encoded back-link query param", async () => {
    renderList(listResponse);
    await screen.findByAltText("Bulbasaur");

    const links = screen.getAllByRole("link");
    const bulbasaurLink = links.find((link) =>
      link.getAttribute("href")?.startsWith("/en/pokemon/bulbasaur?"),
    );

    expect(bulbasaurLink).toHaveAttribute(
      "href",
      `/en/pokemon/bulbasaur?backHref=${encodeURIComponent("/en/pokemon?page=1")}`,
    );
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
    fetchPokemonListMock.mockImplementation((offset: number) =>
      Promise.resolve(
        offset === 0
          ? listResponse
          : {
              ...listResponse,
              previous: "prev-url",
              results: [{ name: "squirtle", url: pokemonUrl(7) }],
            },
      ),
    );

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
