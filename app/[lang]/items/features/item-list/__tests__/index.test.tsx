import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemList } from "../index";
import { fetchItem } from "@/lib/api/items";

jest.mock("@/lib/api/items", () => ({ fetchItem: jest.fn() }));
jest.mock("../ItemListClient", () => ({
  ItemListClient: () => <div data-testid="item-list-client" />,
}));

const fetchItemMock = fetchItem as jest.Mock;

const props = {
  list: {
    count: 2,
    next: null,
    previous: null,
    results: [
      { name: "poke-ball", url: "" },
      { name: "great-ball", url: "" },
    ],
  },
  initialPage: 1,
};

async function renderList() {
  const ui = await ItemList({ ...props });
  render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
}

describe("ItemList (server wrapper)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchItemMock.mockResolvedValue({ id: 1, name: "poke-ball" });
  });

  it("prefetches item details for display names, ignoring failures", async () => {
    fetchItemMock
      .mockResolvedValueOnce({ id: 1, name: "poke-ball" })
      .mockRejectedValueOnce(new Error("boom"));
    await renderList();
    expect(fetchItemMock).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("item-list-client")).toBeInTheDocument();
  });
});
