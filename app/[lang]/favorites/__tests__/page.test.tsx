import { render, screen } from "@testing-library/react";
import FavoritesPage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("../features/favorites-list", () => ({
  FavoritesList: ({ locale, labels }: { locale: string; labels: { empty: string } }) => (
    <div data-testid="favorites-list">
      {locale}|{labels.empty}
    </div>
  ),
}));

describe("FavoritesPage", () => {
  it("renders the header and passes labels to the list", async () => {
    render(await FavoritesPage({ params: Promise.resolve({ lang: "en" }) }));
    expect(screen.getByRole("heading", { name: "Favorites" })).toBeInTheDocument();
    expect(screen.getByTestId("favorites-list")).toHaveTextContent("en|");
  });
});
