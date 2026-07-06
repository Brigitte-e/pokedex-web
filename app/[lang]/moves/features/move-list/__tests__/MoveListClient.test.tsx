import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoveListClient } from "../MoveListClient";
import { fetchMoveList, fetchMove } from "@/lib/api/moves";
import { MOVE_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/moves", () => ({ fetchMoveList: jest.fn(), fetchMove: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchType: jest.fn().mockResolvedValue(null) }));

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/en/moves",
  useSearchParams: () => mockSearchParams,
  useParams: () => ({ lang: "en" }),
}));

const fetchMoveListMock = fetchMoveList as jest.Mock;
const fetchMoveMock = fetchMove as jest.Mock;

const list = {
  count: MOVE_LIST_PAGE_SIZE * 2,
  next: "next-url",
  previous: null,
  results: [
    { name: "thunderbolt", url: "" },
    { name: "quick-attack", url: "" },
  ],
};

function renderList() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MoveListClient locale="en" />
    </QueryClientProvider>,
  );
}

describe("MoveListClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    window.scrollTo = jest.fn();
    fetchMoveListMock.mockResolvedValue(list);
    fetchMoveMock.mockImplementation((name: string) =>
      Promise.resolve({
        id: 1,
        name,
        accuracy: 100,
        power: 90,
        pp: 15,
        type: { name: "electric", url: "" },
        damage_class: { name: "special", url: "" },
        names: [],
        effect_entries: [],
        flavor_text_entries: [],
      }),
    );
  });

  it("shows the loading state first", () => {
    fetchMoveListMock.mockReturnValue(new Promise(() => {}));
    renderList();
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders an error message when the list fails to load", async () => {
    fetchMoveListMock.mockRejectedValue(new Error("PokeAPI error 500"));
    renderList();
    expect(await screen.findByText("PokeAPI error 500")).toBeInTheDocument();
  });

  it("renders one button per move", async () => {
    renderList();
    expect(await screen.findByRole("button", { name: "Thunderbolt" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quick Attack" })).toBeInTheDocument();
  });

  it("opens the move modal on click", async () => {
    renderList();
    await userEvent.click(await screen.findByRole("button", { name: "Thunderbolt" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(await screen.findByText("Power")).toBeInTheDocument();
  });

  it("navigates to the next page through the pagination", async () => {
    renderList();
    await screen.findByRole("button", { name: "Thunderbolt" });
    await userEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(window.location.pathname + window.location.search).toBe("/en/moves?page=2");
  });
});
