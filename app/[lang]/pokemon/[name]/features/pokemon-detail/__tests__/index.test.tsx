import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonDetailFeature } from "../index";
import { fetchPokemon } from "@/lib/api/pokemon";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { fetchAbility } from "@/lib/api/abilities";
import { fetchType } from "@/lib/api/types";
import { fetchMove } from "@/lib/api/moves";
import { capitalize } from "@/lib/pokeapi";
import { ApiError } from "@/lib/api/client";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/lib/api/pokemon", () => ({ fetchPokemon: jest.fn() }));
jest.mock("@/lib/api/species", () => ({ fetchPokemonSpecies: jest.fn() }));
jest.mock("@/lib/api/abilities", () => ({ fetchAbility: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchType: jest.fn() }));
jest.mock("@/lib/api/moves", () => ({ fetchMove: jest.fn() }));
jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));
jest.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => ({
    favorites: [],
    isFavorite: () => false,
    toggle: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    isAuthenticated: false,
    loading: false,
  }),
}));

const mockNotFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
jest.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
  useParams: () => ({ lang: "en" }),
}));

const fetchPokemonMock = fetchPokemon as jest.Mock;
const fetchSpeciesMock = fetchPokemonSpecies as jest.Mock;
const fetchAbilityMock = fetchAbility as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;
const fetchMoveMock = fetchMove as jest.Mock;

const pikachu = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ slot: 1, type: { name: "electric", url: "" } }],
  abilities: [{ ability: { name: "static", url: "" }, is_hidden: false, slot: 1 }],
  stats: [{ base_stat: 35, effort: 0, stat: { name: "hp", url: "" } }],
  moves: [{ move: { name: "thunderbolt", url: "" }, version_group_details: [] }],
  sprites: { front_default: "/front.png", other: {} },
};

function renderFeature(locale = "en" as const, name = "pikachu") {
  return PokemonDetailFeature({ name, locale });
}

async function renderFeatureWithClient(locale = "en" as const, name = "pikachu") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const ui = await renderFeature(locale, name);
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("PokemonDetailFeature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchPokemonMock.mockResolvedValue(pikachu);
    fetchSpeciesMock.mockResolvedValue({
      names: [{ name: "Pikachu", language: { name: "en", url: "" } }],
    });
    fetchAbilityMock.mockResolvedValue({
      names: [{ name: "Static Cling", language: { name: "en", url: "" } }],
    });
    fetchTypeMock.mockResolvedValue({
      names: [{ name: "Electric", language: { name: "en", url: "" } }],
    });
    fetchMoveMock.mockImplementation((move: string) =>
      Promise.resolve({
        name: move,
        names: [{ name: capitalize(move), language: { name: "en", url: "" } }],
      })
    );
  });

  it("renders hero, stats, abilities and moves", async () => {
    await renderFeatureWithClient();
    expect(screen.getByRole("heading", { name: "Pikachu" })).toBeInTheDocument();
    expect(screen.getByText("#0025")).toBeInTheDocument();
    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getByText("Static Cling")).toBeInTheDocument();
    expect(await screen.findByText("Thunderbolt")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Electric" })).toHaveAttribute(
      "href",
      "/en/types/electric",
    );
  });

  it("falls back to capitalized slugs when secondary lookups fail", async () => {
    fetchSpeciesMock.mockRejectedValue(new Error("boom"));
    fetchAbilityMock.mockRejectedValue(new Error("boom"));
    fetchTypeMock.mockRejectedValue(new Error("boom"));
    await renderFeatureWithClient();
    expect(screen.getByRole("heading", { name: "Pikachu" })).toBeInTheDocument();
    expect(screen.getByText("Static")).toBeInTheDocument();
  });

  it("calls notFound for unknown pokemon", async () => {
    fetchPokemonMock.mockRejectedValue(new ApiError(404, "/pokemon/nope"));
    await expect(renderFeature("en", "nope")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("rethrows non-404 errors", async () => {
    fetchPokemonMock.mockRejectedValue(new ApiError(500, "/pokemon/pikachu"));
    await expect(renderFeature()).rejects.toThrow("PokeAPI error 500");
    expect(mockNotFound).not.toHaveBeenCalled();
  });
});
