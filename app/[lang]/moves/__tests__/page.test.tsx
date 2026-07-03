import { render, screen } from "@testing-library/react";
import MovesPage from "../page";
import { fetchMoveList } from "@/lib/api/moves";
import { MOVE_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/lib/api/moves", () => ({ fetchMoveList: jest.fn() }));
jest.mock("../features/move-list", () => ({
  MoveList: ({ initialPage }: { initialPage: number }) => (
    <div data-testid="move-list">page:{initialPage}</div>
  ),
}));

const fetchMoveListMock = fetchMoveList as jest.Mock;

describe("MovesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMoveListMock.mockResolvedValue({ count: 500, next: null, previous: null, results: [] });
  });

  it("renders the header with the move count and the list", async () => {
    render(
      await MovesPage({
        params: Promise.resolve({ lang: "en" }),
        searchParams: Promise.resolve({}),
      }),
    );
    expect(screen.getByRole("heading", { name: "Moves" })).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
    expect(screen.getByTestId("move-list")).toHaveTextContent("page:1");
    expect(fetchMoveListMock).toHaveBeenCalledWith(0, MOVE_LIST_PAGE_SIZE);
  });

  it("fetches the offset for the requested page", async () => {
    render(
      await MovesPage({
        params: Promise.resolve({ lang: "en" }),
        searchParams: Promise.resolve({ page: "2" }),
      }),
    );
    expect(fetchMoveListMock).toHaveBeenCalledWith(MOVE_LIST_PAGE_SIZE, MOVE_LIST_PAGE_SIZE);
  });
});
