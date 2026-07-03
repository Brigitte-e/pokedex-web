import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonOfTheDayClient, type PokemonOfTheDayData } from "../index";
import { PokemonOfTheDaySkeleton } from "../PokemonOfTheDaySkeleton";
import { usePokemonOfTheDayStore } from "@/store/pokemon-of-the-day";

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

const pokemon: PokemonOfTheDayData = {
  id: 25,
  name: "pikachu",
  localizedName: "Pikachu",
  sprite: "/pikachu.png",
  types: [{ slug: "electric", label: "Electric" }],
  height: 4,
  weight: 60,
};

const labels = {
  mystery: "???",
  mysteryType: "?????",
  viewDetails: "View details",
  reveal: "Reveal today's Pokémon",
  height: "Height",
  weight: "Weight",
  heightUnit: " m",
  weightUnit: " kg",
  addFavorite: "Add to favorites",
  removeFavorite: "Remove from favorites",
};

function renderCard(dayKey = "20000") {
  render(<PokemonOfTheDayClient pokemon={pokemon} dayKey={dayKey} labels={labels} locale="en" />);
}

describe("PokemonOfTheDayClient", () => {
  beforeEach(() => {
    localStorage.clear();
    usePokemonOfTheDayStore.setState({ revealedDayKey: null, hydrated: true });
  });

  it("shows the mystery state before reveal", () => {
    renderCard();
    expect(screen.getByText("???")).toBeInTheDocument();
    expect(screen.getByText("?????")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reveal today's Pokémon" })).toBeInTheDocument();
    expect(screen.queryByText("Pikachu")).not.toBeInTheDocument();
  });

  it("reveals the pokemon on click", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: "Reveal today's Pokémon" }));
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Electric")).toBeInTheDocument();
    expect(screen.getByText("0.4 m")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/en/pokemon/pikachu",
    );
  });

  it("stays hidden when the stored reveal is from another day", () => {
    usePokemonOfTheDayStore.setState({ revealedDayKey: "19999", hydrated: true });
    renderCard("20000");
    expect(screen.getByText("???")).toBeInTheDocument();
  });

  it("shows the revealed card when the stored day matches", () => {
    usePokemonOfTheDayStore.setState({ revealedDayKey: "20000", hydrated: true });
    renderCard("20000");
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });
});

describe("PokemonOfTheDaySkeleton", () => {
  it("renders skeleton placeholders", () => {
    const { container } = render(<PokemonOfTheDaySkeleton />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});
