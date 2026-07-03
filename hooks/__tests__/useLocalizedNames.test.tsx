import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocalizedPokemonNames } from "../useLocalizedPokemonNames";
import { useLocalizedTypeNames } from "../useLocalizedTypeNames";
import { fetchPokemonSpecies } from "@/lib/api/species";
import { fetchTypeList, fetchType } from "@/lib/api/types";

jest.mock("@/lib/api/species", () => ({ fetchPokemonSpecies: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchTypeList: jest.fn(), fetchType: jest.fn() }));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useLocalizedPokemonNames", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns capitalized slugs for the default locale without fetching", () => {
    const { result } = renderHook(() => useLocalizedPokemonNames(["mr-mime"], "en"), { wrapper });
    expect(result.current.get("mr-mime")).toBe("Mr Mime");
    expect(fetchPokemonSpecies).not.toHaveBeenCalled();
  });

  it("returns localized names for other locales", async () => {
    (fetchPokemonSpecies as jest.Mock).mockResolvedValue({
      names: [{ name: "Pantimos", language: { name: "de", url: "" } }],
    });
    const { result } = renderHook(() => useLocalizedPokemonNames(["mr-mime"], "de"), { wrapper });
    await waitFor(() => expect(result.current.get("mr-mime")).toBe("Pantimos"));
  });
});

describe("useLocalizedTypeNames", () => {
  beforeEach(() => jest.clearAllMocks());

  it("skips fetching entirely for the default locale", () => {
    const { result } = renderHook(() => useLocalizedTypeNames("en"), { wrapper });
    expect(result.current.size).toBe(0);
    expect(fetchTypeList).not.toHaveBeenCalled();
  });

  it("maps localized names for other locales, excluding non-standard types", async () => {
    (fetchTypeList as jest.Mock).mockResolvedValue({
      results: [
        { name: "fire", url: "" },
        { name: "unknown", url: "" },
      ],
    });
    (fetchType as jest.Mock).mockResolvedValue({
      names: [{ name: "Feuer", language: { name: "de", url: "" } }],
    });
    const { result } = renderHook(() => useLocalizedTypeNames("de"), { wrapper });
    await waitFor(() => expect(result.current.get("fire")).toBe("Feuer"));
    expect(result.current.has("unknown")).toBe(false);
  });
});
