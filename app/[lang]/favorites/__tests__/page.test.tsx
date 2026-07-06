import { render, screen } from "@testing-library/react";
import FavoritesPage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("next/navigation", () => ({ useParams: () => ({ lang: "en" }) }));
jest.mock("../features/favorites-list", () => ({
  FavoritesList: () => <div data-testid="favorites-list" />,
}));

describe("FavoritesPage", () => {
  it("renders the header and favorites list", async () => {
    render(await FavoritesPage());
    expect(screen.getByRole("heading", { name: "Favorites" })).toBeInTheDocument();
    expect(screen.getByTestId("favorites-list")).toBeInTheDocument();
  });
});
