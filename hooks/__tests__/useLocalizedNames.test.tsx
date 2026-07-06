import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocalizedPokemonNames } from "../useLocalizedPokemonNames";
import { fetchPokemonSpecies } from "@/lib/api/species";

jest.mock("@/lib/api/species", () => ({ fetchPokemonSpecies: jest.fn() }));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useLocalizedPokemonNames", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns localized names from species data", async () => {
    (fetchPokemonSpecies as jest.Mock).mockResolvedValue({
      names: [{ name: "Mr. Mime", language: { name: "en", url: "" } }],
    });
    const { result } = renderHook(() => useLocalizedPokemonNames(["mr-mime"], "en"), { wrapper });
    await waitFor(() => expect(result.current.get("mr-mime")).toBe("Mr. Mime"));
    expect(fetchPokemonSpecies).toHaveBeenCalledWith("mr-mime");
  });

  it("returns localized names for other locales", async () => {
    (fetchPokemonSpecies as jest.Mock).mockResolvedValue({
      names: [{ name: "Pantimos", language: { name: "de", url: "" } }],
    });
    const { result } = renderHook(() => useLocalizedPokemonNames(["mr-mime"], "de"), { wrapper });
    expect(result.current.has("mr-mime")).toBe(false);
    await waitFor(() => expect(result.current.get("mr-mime")).toBe("Pantimos"));
  });
});
