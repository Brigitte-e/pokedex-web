import { render as rtlRender, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PokemonPage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("../features/pokemon-filters", () => ({
  PokemonFiltersFeature: () => <div data-testid="filters" />,
}));
jest.mock("../features/pokemon-list", () => ({
  PokemonListFeature: () => <div data-testid="list" />,
}));

function renderPage(searchParams: Record<string, string> = {}, lang = "en") {
  return PokemonPage({
    params: Promise.resolve({ lang }),
    searchParams: Promise.resolve(searchParams),
  });
}

function render(ui: React.ReactElement) {
  return rtlRender(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
}

describe("PokemonPage", () => {
  it("renders filters and the pokemon list", async () => {
    render(await renderPage());
    expect(screen.getByTestId("filters")).toBeInTheDocument();
    expect(screen.getByTestId("list")).toBeInTheDocument();
  });
});
