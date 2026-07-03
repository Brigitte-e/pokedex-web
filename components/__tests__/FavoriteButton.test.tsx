import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteButton } from "../FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";

jest.mock("@/hooks/useFavorites", () => ({ useFavorites: jest.fn() }));

const useFavoritesMock = useFavorites as jest.Mock;

function mockFavorites(overrides: Partial<ReturnType<typeof useFavorites>> = {}) {
  useFavoritesMock.mockReturnValue({
    favorites: [],
    isFavorite: () => false,
    toggle: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn(),
    clear: jest.fn(),
    isAuthenticated: true,
    loading: false,
    ...overrides,
  });
}

describe("FavoriteButton", () => {
  it("renders nothing for unauthenticated users", () => {
    mockFavorites({ isAuthenticated: false });
    const { container } = render(<FavoriteButton id={25} name="pikachu" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the add label when the item is not a favorite", () => {
    mockFavorites();
    render(<FavoriteButton id={25} name="pikachu" addLabel="Add to favorites" />);
    expect(screen.getByRole("button", { name: "Add to favorites" })).toHaveTextContent("☆");
  });

  it("shows the remove label when the item is a favorite", () => {
    mockFavorites({ isFavorite: (id: string) => id === "25" });
    render(<FavoriteButton id={25} name="pikachu" removeLabel="Remove from favorites" />);
    expect(screen.getByRole("button", { name: "Remove from favorites" })).toHaveTextContent("★");
  });

  it("toggles the favorite with a string id on click", async () => {
    const toggle = jest.fn().mockResolvedValue(undefined);
    mockFavorites({ toggle });
    render(<FavoriteButton id={25} name="pikachu" image="img.png" />);
    await userEvent.click(screen.getByRole("button"));
    expect(toggle).toHaveBeenCalledWith({
      id: "25",
      name: "pikachu",
      image: "img.png",
      type: undefined,
      source: undefined,
    });
  });
});
