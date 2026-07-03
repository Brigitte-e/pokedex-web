import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GenerationFilter } from "../index";
import { fetchGenerationList } from "@/lib/api/generations";
import type { GenerationSelectLabels } from "@/components/GenerationSelect";

jest.mock("@/lib/api/generations", () => ({ fetchGenerationList: jest.fn() }));

const fetchGenerationListMock = fetchGenerationList as jest.Mock;

const labels: GenerationSelectLabels = {
  filterByGeneration: "Filter by generation",
  allGenerations: "All generations",
  generationPattern: "Generation {suffix}",
  generationPrefix: "generation-",
};

function renderFilter(selected: string | null = null, onChange = jest.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <GenerationFilter selected={selected} onChange={onChange} labels={labels} />
    </QueryClientProvider>,
  );
  return onChange;
}

describe("GenerationFilter", () => {
  beforeEach(() => jest.clearAllMocks());

  it("lists the fetched generations", async () => {
    fetchGenerationListMock.mockResolvedValue({
      results: [{ name: "generation-i", url: "https://pokeapi.co/api/v2/generation/1/" }],
    });
    renderFilter();
    await userEvent.click(screen.getByRole("combobox"));
    expect(await screen.findByRole("option", { name: /Generation I/ })).toBeInTheDocument();
  });

  it("still allows clearing the selection when the list fails to load", async () => {
    fetchGenerationListMock.mockRejectedValue(new Error("boom"));
    const onChange = renderFilter("generation-i");
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: /All generations/ }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
