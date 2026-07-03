import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMoveListQuery } from "../useMoveListQuery";
import { fetchMoveList } from "@/lib/api/moves";
import { MOVE_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/moves", () => ({ fetchMoveList: jest.fn() }));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useMoveListQuery", () => {
  it("fetches the requested page with the right offset", async () => {
    (fetchMoveList as jest.Mock).mockResolvedValue({ count: 1, results: [] });
    const { result } = renderHook(() => useMoveListQuery({ page: 3 }), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchMoveList).toHaveBeenCalledWith(2 * MOVE_LIST_PAGE_SIZE, MOVE_LIST_PAGE_SIZE);
  });
});
