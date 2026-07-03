import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePokemonListQuery } from "../usePokemonListQuery";
import { useTypeListQuery, useTypesMultiQuery } from "../useTypeFilterQuery";
import { useGenerationListQuery, useGenerationQuery } from "../useGenerationFilterQuery";
import { fetchPokemonList } from "@/lib/api/pokemon";
import { fetchTypeList, fetchType } from "@/lib/api/types";
import { fetchGenerationList, fetchGeneration } from "@/lib/api/generations";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/pokemon", () => ({ fetchPokemonList: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchTypeList: jest.fn(), fetchType: jest.fn() }));
jest.mock("@/lib/api/generations", () => ({
  fetchGenerationList: jest.fn(),
  fetchGeneration: jest.fn(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => jest.clearAllMocks());

describe("usePokemonListQuery", () => {
  it("fetches the requested page with the right offset", async () => {
    (fetchPokemonList as jest.Mock).mockResolvedValue({ count: 1, results: [] });
    const { result } = renderHook(() => usePokemonListQuery({ page: 3 }), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchPokemonList).toHaveBeenCalledWith(
      2 * POKEMON_LIST_PAGE_SIZE,
      POKEMON_LIST_PAGE_SIZE,
    );
  });

  it("does not fetch when disabled", () => {
    renderHook(() => usePokemonListQuery({ page: 1, enabled: false }), { wrapper });
    expect(fetchPokemonList).not.toHaveBeenCalled();
  });
});

describe("useTypeListQuery", () => {
  it("filters out the unknown and stellar types", async () => {
    (fetchTypeList as jest.Mock).mockResolvedValue({
      results: [
        { name: "fire", url: "" },
        { name: "unknown", url: "" },
        { name: "stellar", url: "" },
      ],
    });
    const { result } = renderHook(() => useTypeListQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ name: "fire", url: "" }]);
  });
});

describe("useTypesMultiQuery", () => {
  it("fetches all selected types in sorted order", async () => {
    (fetchType as jest.Mock).mockImplementation((name: string) =>
      Promise.resolve({ name, pokemon: [] }),
    );
    const { result } = renderHook(() => useTypesMultiQuery(["water", "fire"]), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((t) => t.name)).toEqual(["fire", "water"]);
  });

  it("stays idle without selected types", () => {
    renderHook(() => useTypesMultiQuery([]), { wrapper });
    expect(fetchType).not.toHaveBeenCalled();
  });
});

describe("useGenerationListQuery", () => {
  it("sorts generations by their numeric id", async () => {
    (fetchGenerationList as jest.Mock).mockResolvedValue({
      results: [
        { name: "generation-iii", url: "https://pokeapi.co/api/v2/generation/3/" },
        { name: "generation-i", url: "https://pokeapi.co/api/v2/generation/1/" },
      ],
    });
    const { result } = renderHook(() => useGenerationListQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((g) => g.name)).toEqual([
      "generation-i",
      "generation-iii",
    ]);
  });
});

describe("useGenerationQuery", () => {
  it("fetches the selected generation", async () => {
    (fetchGeneration as jest.Mock).mockResolvedValue({ name: "generation-i" });
    const { result } = renderHook(() => useGenerationQuery("generation-i"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchGeneration).toHaveBeenCalledWith("generation-i");
  });

  it("stays idle without a generation", () => {
    renderHook(() => useGenerationQuery(null), { wrapper });
    expect(fetchGeneration).not.toHaveBeenCalled();
  });
});
