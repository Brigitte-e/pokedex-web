import { render, screen } from "@testing-library/react";
import PokemonOfTheDayPage from "../page";
import { fetchPokemon } from "@/lib/api/pokemon";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { fetchType } from "@/lib/api/types";
import type { PokemonOfTheDayData } from "../features/pokemon-of-the-day";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/lib/api/pokemon", () => ({ fetchPokemon: jest.fn() }));
jest.mock("@/lib/api/species", () => ({ fetchPokemonSpecies: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchType: jest.fn() }));
jest.mock("../features/pokemon-of-the-day", () => ({
  PokemonOfTheDayClient: ({ pokemon }: { pokemon: PokemonOfTheDayData }) => (
    <div data-testid="potd">
      {pokemon.localizedName}|{pokemon.sprite}|{pokemon.types.map((t) => t.label).join("+")}
    </div>
  ),
}));

const fetchPokemonMock = fetchPokemon as jest.Mock;
const fetchSpeciesMock = fetchPokemonSpecies as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;

const pokemon = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: { name: "electric", url: "" } }],
  sprites: { front_default: "/front.png", other: {} },
};

describe("PokemonOfTheDayPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchPokemonMock.mockResolvedValue(pokemon);
    fetchSpeciesMock.mockResolvedValue({
      names: [{ name: "Pika", language: { name: "en", url: "" } }],
    });
    fetchTypeMock.mockResolvedValue({
      names: [{ name: "Electric!", language: { name: "en", url: "" } }],
    });
  });

  it("renders the header and the localized daily pick", async () => {
    render(await PokemonOfTheDayPage({ params: Promise.resolve({ lang: "en" }) }));
    expect(screen.getByRole("heading", { name: "Pokémon of the Day" })).toBeInTheDocument();
    expect(screen.getByTestId("potd")).toHaveTextContent("Pika|/front.png|Electric!");
  });

  it("falls back to capitalized slugs when species and type lookups fail", async () => {
    fetchSpeciesMock.mockRejectedValue(new Error("boom"));
    fetchTypeMock.mockRejectedValue(new Error("boom"));
    render(await PokemonOfTheDayPage({ params: Promise.resolve({ lang: "en" }) }));
    expect(screen.getByTestId("potd")).toHaveTextContent("Pikachu");
    expect(screen.getByTestId("potd")).toHaveTextContent("Electric");
  });

  it("prefers the official artwork sprite when present", async () => {
    fetchPokemonMock.mockResolvedValue({
      ...pokemon,
      sprites: {
        front_default: "/front.png",
        other: { "official-artwork": { front_default: "/artwork.png" } },
      },
    });
    render(await PokemonOfTheDayPage({ params: Promise.resolve({ lang: "en" }) }));
    expect(screen.getByTestId("potd")).toHaveTextContent("/artwork.png");
  });
});
