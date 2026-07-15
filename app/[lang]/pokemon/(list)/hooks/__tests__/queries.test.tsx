import { Suspense } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePokemonListQuery } from "../usePokemonListQuery";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/pokemon", () => ({ fetchPokemonList: jest.fn() }));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={client}>
      <Suspense fallback="loading">{children}</Suspense>
    </QueryClientProvider>
  );
}

beforeEach(() => jest.clearAllMocks());

describe("usePokemonListQuery", () => {
  it("fetches the first page with zero offset", async () => {
    (fetchPokemonList as jest.Mock).mockResolvedValue({
      count: 1,
      results: [],
      next: null,
      previous: null,
    });
    const { result } = renderHook(() => usePokemonListQuery(1), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchPokemonList).toHaveBeenCalledWith(0, POKEMON_LIST_PAGE_SIZE);
  });

  it("uses initial data without refetching on mount", () => {
    (fetchPokemonList as jest.Mock).mockResolvedValue({
      count: 1,
      results: [{ name: "bulbasaur", url: "" }],
      next: null,
      previous: null,
    });
    renderHook(
      () =>
        usePokemonListQuery(1, {
          count: 1,
          results: [{ name: "bulbasaur", url: "" }],
          next: null,
          previous: null,
        }),
      { wrapper },
    );
    expect(fetchPokemonList).not.toHaveBeenCalled();
  });
});
