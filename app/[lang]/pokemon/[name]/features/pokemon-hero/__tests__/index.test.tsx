import { render, screen } from "@testing-library/react";
import { PokemonHero } from "../index";
import type { Pokemon } from "@/types";

jest.mock("next/navigation", () => ({ useParams: () => ({ lang: "en" }) }));

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
    isAuthenticated: true,
    loading: false,
  }),
}));

const pokemon = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ slot: 1, type: { name: "electric", url: "" } }],
  sprites: {
    front_default: "/front.png",
    other: { "official-artwork": { front_default: "/artwork.png" } },
  },
} as unknown as Pokemon;

describe("PokemonHero", () => {
  it("renders the localized name and padded number", () => {
    render(
      <PokemonHero
        pokemon={pokemon}
        localizedName="Pikachu"
        typeNameMap={{ electric: "Electric" }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Pikachu" })).toBeInTheDocument();
    expect(screen.getByText("#0025")).toBeInTheDocument();
  });

  it("prefers the official artwork sprite", () => {
    render(
      <PokemonHero
        pokemon={pokemon}
        localizedName="Pikachu"
        typeNameMap={{}}
      />,
    );
    expect(screen.getByRole("img", { name: "pikachu" })).toHaveAttribute("src", "/artwork.png");
  });

  it("links type badges to the type page with the localized name", () => {
    render(
      <PokemonHero
        pokemon={pokemon}
        localizedName="Pikachu"
        typeNameMap={{ electric: "Electric" }}
      />,
    );
    expect(screen.getByRole("link", { name: "Electric" })).toHaveAttribute(
      "href",
      "/en/types/electric",
    );
  });

  it("formats height and weight in metric units", () => {
    render(
      <PokemonHero
        pokemon={pokemon}
        localizedName="Pikachu"
        typeNameMap={{}}
      />,
    );
    expect(screen.getByText("0.4 m")).toBeInTheDocument();
    expect(screen.getByText("6.0 kg")).toBeInTheDocument();
    expect(screen.getByText("112")).toBeInTheDocument();
  });

  it("shows the empty label when base experience is missing", () => {
    render(
      <PokemonHero
        pokemon={{ ...pokemon, base_experience: null } as unknown as Pokemon}
        localizedName="Pikachu"
        typeNameMap={{}}
      />,
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
