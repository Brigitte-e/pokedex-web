import { render, screen } from "@testing-library/react";
import { Nav, type NavLabels } from "../Nav";
import { useAuthStore } from "@/store/auth";
import type { User } from "firebase/auth";

let mockPathname = "/en/pokemon";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: jest.fn() }),
}));

const labels: NavLabels = {
  logo: "PokéDex",
  ariaLabel: "Main navigation",
  pokemon: "Pokémon",
  types: "Types",
  moves: "Moves",
  items: "Items",
  pokemonOfTheDay: "Pokémon of the Day",
  favorites: "Favorites",
  login: "Log in",
  profile: "Profile",
};

describe("Nav", () => {
  beforeEach(() => {
    mockPathname = "/en/pokemon";
    useAuthStore.setState({ user: null, loading: false });
  });

  it("renders all navigation links with locale-prefixed hrefs", () => {
    render(<Nav labels={labels} locale="en" />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Types" })).toHaveAttribute("href", "/en/types");
    expect(screen.getByRole("link", { name: "Moves" })).toHaveAttribute("href", "/en/moves");
    expect(screen.getByRole("link", { name: "Items" })).toHaveAttribute("href", "/en/items");
  });

  it("marks the current section as active", () => {
    mockPathname = "/en/types";
    render(<Nav labels={labels} locale="en" />);
    expect(screen.getByRole("link", { name: "Types" })).toHaveClass("bg-pk-red");
    expect(screen.getByRole("link", { name: "Moves" })).not.toHaveClass("bg-pk-red");
  });

  it("points favorites to login for guests", () => {
    render(<Nav labels={labels} locale="en" />);
    expect(screen.getByRole("link", { name: "Favorites" })).toHaveAttribute("href", "/en/login");
  });

  it("points favorites to the favorites page for signed-in users", () => {
    useAuthStore.setState({ user: { uid: "u1" } as User, loading: false });
    render(<Nav labels={labels} locale="en" />);
    expect(screen.getByRole("link", { name: "Favorites" })).toHaveAttribute(
      "href",
      "/en/favorites",
    );
  });
});
