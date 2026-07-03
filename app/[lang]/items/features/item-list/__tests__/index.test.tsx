import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemList } from "../index";
import { fetchItem } from "@/lib/api/items";
import type { ItemModalLabels } from "@/components/ItemModal";

jest.mock("@/lib/api/items", () => ({ fetchItem: jest.fn() }));
jest.mock("../ItemListClient", () => ({
  ItemListClient: ({ locale }: { locale: string }) => (
    <div data-testid="item-list-client">{locale}</div>
  ),
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
  itemModalLabels: {} as ItemModalLabels,
  listLabels: {
    previous: "Prev",
    next: "Next",
    pageOfTotalPattern: "{page}/{total}",
    pagination: "Pagination",
    loading: "Loading…",
    errorDefault: "Error",
  },
};

async function renderList(locale?: "en" | "de") {
  const ui = await ItemList({ ...props, locale });
  render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
}

describe("ItemList (server wrapper)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchItemMock.mockResolvedValue({ id: 1, name: "poke-ball" });
  });

  it("hydrates the client without item prefetches for the default locale", async () => {
    await renderList();
    expect(screen.getByTestId("item-list-client")).toHaveTextContent("en");
    expect(fetchItemMock).not.toHaveBeenCalled();
  });

  it("prefetches item details for non-default locales, ignoring failures", async () => {
    fetchItemMock
      .mockResolvedValueOnce({ id: 1, name: "poke-ball" })
      .mockRejectedValueOnce(new Error("boom"));
    await renderList("de");
    expect(fetchItemMock).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("item-list-client")).toHaveTextContent("de");
  });
});
