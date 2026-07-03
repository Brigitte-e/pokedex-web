import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePokemonQuery } from "../usePokemonQuery";
import { fetchPokemon } from "@/lib/api/pokemon";
import type { Pokemon } from "@/types";

jest.mock("@/lib/api/pokemon", () => ({ fetchPokemon: jest.fn() }));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("usePokemonQuery", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fetches the pokemon by name", async () => {
    (fetchPokemon as jest.Mock).mockResolvedValue({ id: 25, name: "pikachu" });
    const { result } = renderHook(() => usePokemonQuery({ name: "pikachu" }), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchPokemon).toHaveBeenCalledWith("pikachu");
    expect(result.current.data).toEqual({ id: 25, name: "pikachu" });
  });

  it("serves initialData without waiting for the fetch", () => {
    const initialData = { id: 25, name: "pikachu" } as Pokemon;
    const { result } = renderHook(() => usePokemonQuery({ name: "pikachu", initialData }), {
      wrapper,
    });
    expect(result.current.data).toBe(initialData);
  });
});
