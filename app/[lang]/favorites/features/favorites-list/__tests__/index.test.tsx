import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesList } from "../index";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuthStore } from "@/store/auth";

jest.mock("@/hooks/useFavorites", () => ({ useFavorites: jest.fn() }));
jest.mock("@/hooks/useLocalizedPokemonNames", () => ({
  useLocalizedPokemonNames: (names: string[]) => new Map(names.map((n) => [n, n])),
}));
jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const useFavoritesMock = useFavorites as jest.Mock;

const labels = {
  loading: "Loading…",
  empty: "No favorites yet.",
  savedCountPattern: "{count} saved Pokémon",
  removeLabel: "Remove from favorites",
  clearAll: "Clear all favorites",
  confirmRemove: "Really remove?",
  confirmRemoveCancel: "Cancel",
  confirmRemoveConfirm: "Remove",
  confirmClearAll: "Really clear all?",
  confirmClearAllConfirm: "Clear all",
};

function mockFavorites(overrides: Partial<ReturnType<typeof useFavorites>> = {}) {
  useFavoritesMock.mockReturnValue({
    favorites: [],
    isFavorite: () => false,
    toggle: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    isAuthenticated: true,
    loading: false,
    ...overrides,
  });
}

describe("FavoritesList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, loading: false });
  });

  it("shows the loading text while favorites load", () => {
    mockFavorites({ loading: true });
    render(<FavoritesList labels={labels} locale="en" />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("redirects guests to the login page", () => {
    mockFavorites({ isAuthenticated: false });
    render(<FavoritesList labels={labels} locale="en" />);
    expect(mockReplace).toHaveBeenCalledWith("/en/login");
  });

  it("shows the empty message without favorites", () => {
    mockFavorites();
    render(<FavoritesList labels={labels} locale="en" />);
    expect(screen.getByText("No favorites yet.")).toBeInTheDocument();
  });

  it("renders a card per favorite and the saved count", () => {
    mockFavorites({
      favorites: [
        { id: "25", name: "pikachu" },
        { id: "1", name: "bulbasaur" },
      ],
    });
    render(<FavoritesList labels={labels} locale="en" />);
    expect(screen.getByText("2 saved Pokémon")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Remove from favorites" })).toHaveLength(2);
  });

  it("removes a favorite after confirmation", async () => {
    const remove = jest.fn();
    mockFavorites({ favorites: [{ id: "25", name: "pikachu" }], remove });
    render(<FavoritesList labels={labels} locale="en" />);
    await userEvent.click(screen.getByRole("button", { name: "Remove from favorites" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(remove).toHaveBeenCalledWith("25");
  });

  it("clears all favorites after confirmation", async () => {
    const clear = jest.fn();
    mockFavorites({ favorites: [{ id: "25", name: "pikachu" }], clear });
    render(<FavoritesList labels={labels} locale="en" />);
    await userEvent.click(screen.getByRole("button", { name: "Clear all favorites" }));
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(clear).toHaveBeenCalled();
  });
});
