import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoveList } from "../index";
import { fetchMove } from "@/lib/api/moves";

jest.mock("@/lib/api/moves", () => ({ fetchMove: jest.fn() }));
jest.mock("../MoveListClient", () => ({
  MoveListClient: () => <div data-testid="move-list-client" />,
}));

const fetchMoveMock = fetchMove as jest.Mock;

const props = {
  list: {
    count: 2,
    next: null,
    previous: null,
    results: [
      { name: "thunderbolt", url: "" },
      { name: "ember", url: "" },
    ],
  },
  initialPage: 1,
};

async function renderList() {
  const ui = await MoveList({ ...props });
  render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
}

describe("MoveList (server wrapper)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMoveMock.mockResolvedValue({ id: 1, name: "thunderbolt" });
  });

  it("prefetches move details for display names, ignoring failures", async () => {
    fetchMoveMock
      .mockResolvedValueOnce({ id: 1, name: "thunderbolt" })
      .mockRejectedValueOnce(new Error("boom"));
    await renderList();
    expect(fetchMoveMock).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("move-list-client")).toBeInTheDocument();
  });
});
