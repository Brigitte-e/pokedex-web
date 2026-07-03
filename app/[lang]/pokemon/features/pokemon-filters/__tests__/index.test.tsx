import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonFilters } from "../index";
import { fetchTypeList } from "@/lib/api/types";
import { fetchGenerationList } from "@/lib/api/generations";

jest.mock("@/lib/api/types", () => ({ fetchTypeList: jest.fn(), fetchType: jest.fn() }));
jest.mock("@/lib/api/generations", () => ({ fetchGenerationList: jest.fn() }));

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/en/pokemon",
}));

const fetchTypeListMock = fetchTypeList as jest.Mock;
const fetchGenerationListMock = fetchGenerationList as jest.Mock;

const genLabels = {
  filterByGeneration: "Filter by generation",
  allGenerations: "All generations",
  generationPattern: "Generation {suffix}",
  generationPrefix: "generation-",
};

const typeLabels = {
  filterByType: "Filter by type",
  typesSelectedPattern: "{count} types selected",
  clearAll: "Clear all",
  searchPlaceholder: "Search types…",
  noTypesFound: "No types found",
  scrollForMore: "Scroll for more…",
  removeTypePattern: "Remove {name}",
  clearSearch: "Clear search",
};

function renderFilters(selectedTypes: string[] = [], selectedGeneration: string | null = null) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <PokemonFilters
        selectedTypes={selectedTypes}
        selectedGeneration={selectedGeneration}
        title="Pokédex"
        genLabels={genLabels}
        typeLabels={typeLabels}
        locale="en"
      />
    </QueryClientProvider>,
  );
}

describe("PokemonFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchTypeListMock.mockResolvedValue({
      count: 3,
      next: null,
      previous: null,
      results: [
        { name: "fire", url: "https://pokeapi.co/api/v2/type/10/" },
        { name: "water", url: "https://pokeapi.co/api/v2/type/11/" },
        { name: "unknown", url: "https://pokeapi.co/api/v2/type/10001/" },
      ],
    });
    fetchGenerationListMock.mockResolvedValue({
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: "generation-ii", url: "https://pokeapi.co/api/v2/generation/2/" },
        { name: "generation-i", url: "https://pokeapi.co/api/v2/generation/1/" },
      ],
    });
  });

  it("renders the page title and both filters", async () => {
    renderFilters();
    expect(screen.getByRole("heading", { name: "Pokédex" })).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
  });

  it("adds a type filter to the URL, excluding non-standard types", async () => {
    renderFilters();
    await userEvent.click(screen.getByText("Filter by type"));
    expect(await screen.findByRole("option", { name: /Fire/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Unknown/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("option", { name: /Fire/ }));
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon?types=fire", { scroll: false });
  });

  it("adds a generation filter to the URL, sorted by id", async () => {
    renderFilters();
    await userEvent.click(screen.getByText("Filter by generation"));
    const options = await screen.findAllByRole("option");
    // "All generations" first, then generations sorted by numeric id
    expect(options[1]).toHaveTextContent("Generation I");
    expect(options[2]).toHaveTextContent("Generation II");
    await userEvent.click(options[1]);
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon?generation=generation-i", {
      scroll: false,
    });
  });

  it("keeps the selected generation when changing types", async () => {
    renderFilters([], "generation-i");
    await userEvent.click(screen.getByText("Filter by type"));
    await userEvent.click(await screen.findByRole("option", { name: /Water/ }));
    expect(mockReplace).toHaveBeenCalledWith(
      "/en/pokemon?types=water&generation=generation-i",
      { scroll: false },
    );
  });

  it("clears all filters back to the bare path", async () => {
    renderFilters(["fire"], null);
    await userEvent.click(await screen.findByRole("button", { name: "Clear all" }));
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon", { scroll: false });
  });
});
