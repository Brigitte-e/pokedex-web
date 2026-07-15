import { render, screen } from "@testing-library/react";
import PokemonDetailPage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("../features/pokemon-detail", () => ({
  PokemonDetailFeature: () => <div data-testid="detail" />,
}));

function renderPage(
  lang = "en",
  name = "pikachu",
  searchParams: RawSearchParams = {},
) {
  return PokemonDetailPage({
    params: Promise.resolve({ lang, name }),
    searchParams: Promise.resolve(searchParams),
  });
}

describe("PokemonDetailPage", () => {
  it("renders the back link and the pokemon detail feature", async () => {
    render(await renderPage());
    expect(screen.getByRole("link", { name: "← Back" })).toHaveAttribute(
      "href",
      "/en/pokemon",
    );
    expect(screen.getByTestId("detail")).toBeInTheDocument();
  });

  it("uses the backHref search param to link back to the originating list page", async () => {
    render(await renderPage("en", "pikachu", { backHref: "/en/pokemon?page=2" }));
    expect(screen.getByRole("link", { name: "← Back" })).toHaveAttribute(
      "href",
      "/en/pokemon?page=2",
    );
  });
});
