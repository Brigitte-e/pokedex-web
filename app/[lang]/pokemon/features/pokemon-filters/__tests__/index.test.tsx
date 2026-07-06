import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonFiltersFeature } from "../index";
import { fetchTypeList, fetchType } from "@/lib/api/types";
import { fetchGenerationList } from "@/lib/api/generations";

jest.mock("@/lib/api/types", () => ({ fetchTypeList: jest.fn(), fetchType: jest.fn() }));
jest.mock("@/lib/api/generations", () => ({ fetchGenerationList: jest.fn() }));

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/en/pokemon",
  useSearchParams: () => mockSearchParams,
  useParams: () => ({ lang: "en" }),
}));

const fetchTypeListMock = fetchTypeList as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;
const fetchGenerationListMock = fetchGenerationList as jest.Mock;

function renderFilters(searchParams: URLSearchParams = new URLSearchParams()) {
  mockSearchParams = searchParams;
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <PokemonFiltersFeature />
    </QueryClientProvider>,
  );
}

describe("PokemonFiltersFeature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
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
    fetchTypeMock.mockImplementation((name: string) =>
      Promise.resolve({
        names: [
          {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            language: { name: "en", url: "" },
          },
        ],
      }),
    );
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
    expect(options[1]).toHaveTextContent("generation-i");
    expect(options[2]).toHaveTextContent("generation-ii");
    await userEvent.click(options[1]);
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon?generation=generation-i", {
      scroll: false,
    });
  });

  it("keeps the selected generation when changing types", async () => {
    renderFilters(new URLSearchParams("generation=generation-i"));
    await userEvent.click(screen.getByText("Filter by type"));
    await userEvent.click(await screen.findByRole("option", { name: /Water/ }));
    expect(mockReplace).toHaveBeenCalledWith(
      "/en/pokemon?types=water&generation=generation-i",
      { scroll: false },
    );
  });

  it("clears all filters back to the bare path", async () => {
    renderFilters(new URLSearchParams("types=fire"));
    await userEvent.click(await screen.findByRole("button", { name: "Clear all" }));
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon", { scroll: false });
  });

  it("removes the page param when changing filters", async () => {
    renderFilters(new URLSearchParams("page=3"));
    await userEvent.click(screen.getByText("Filter by generation"));
    const options = await screen.findAllByRole("option");
    await userEvent.click(options[1]);
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon?generation=generation-i", {
      scroll: false,
    });
  });
});
