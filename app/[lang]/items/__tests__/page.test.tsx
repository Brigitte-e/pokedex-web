import { render, screen } from "@testing-library/react";
import ItemsPage from "../page";
import { fetchItemList } from "@/lib/api/items";
import { ITEM_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/lib/api/items", () => ({ fetchItemList: jest.fn() }));
jest.mock("../features/item-list", () => ({
  ItemList: ({ initialPage }: { initialPage: number }) => (
    <div data-testid="item-list">page:{initialPage}</div>
  ),
}));

const fetchItemListMock = fetchItemList as jest.Mock;

describe("ItemsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchItemListMock.mockResolvedValue({ count: 100, next: null, previous: null, results: [] });
  });

  it("renders the header with the item count and the list", async () => {
    render(
      await ItemsPage({
        params: Promise.resolve({ lang: "en" }),
        searchParams: Promise.resolve({}),
      }),
    );
    expect(screen.getByRole("heading", { name: "Items" })).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByTestId("item-list")).toHaveTextContent("page:1");
    expect(fetchItemListMock).toHaveBeenCalledWith(0, ITEM_LIST_PAGE_SIZE);
  });

  it("fetches the offset for the requested page", async () => {
    render(
      await ItemsPage({
        params: Promise.resolve({ lang: "en" }),
        searchParams: Promise.resolve({ page: "3" }),
      }),
    );
    expect(fetchItemListMock).toHaveBeenCalledWith(2 * ITEM_LIST_PAGE_SIZE, ITEM_LIST_PAGE_SIZE);
    expect(screen.getByTestId("item-list")).toHaveTextContent("page:3");
  });
});
