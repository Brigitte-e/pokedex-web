import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useItemListQuery } from "../useItemListQuery";
import { fetchItemList } from "@/lib/api/items";
import { ITEM_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/items", () => ({ fetchItemList: jest.fn() }));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useItemListQuery", () => {
  it("fetches the requested page with the right offset", async () => {
    (fetchItemList as jest.Mock).mockResolvedValue({ count: 1, results: [] });
    const { result } = renderHook(() => useItemListQuery({ page: 2 }), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchItemList).toHaveBeenCalledWith(ITEM_LIST_PAGE_SIZE, ITEM_LIST_PAGE_SIZE);
  });
});
