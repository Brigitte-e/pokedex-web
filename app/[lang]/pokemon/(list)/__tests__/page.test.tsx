import { render, screen } from "@testing-library/react";
import PokemonPage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("../features/pokemon-list", () => ({
  PokemonListFeature: () => <div data-testid="list" />,
}));

function renderPage(searchParams: Record<string, string> = {}) {
  return PokemonPage({
    searchParams: Promise.resolve(searchParams),
  });
}

describe("PokemonPage", () => {
  it("renders the header and the pokemon list", async () => {
    render(await renderPage());
    expect(screen.getByRole("heading", { name: "Pokémon" })).toBeInTheDocument();
    expect(screen.getByTestId("list")).toBeInTheDocument();
  });
});
