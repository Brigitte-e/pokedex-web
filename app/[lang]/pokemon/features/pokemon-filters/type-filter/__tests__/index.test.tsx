import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TypeFilter } from "../index";
import { fetchTypeList, fetchType } from "@/lib/api/types";

jest.mock("@/lib/api/types", () => ({ fetchTypeList: jest.fn(), fetchType: jest.fn() }));

const fetchTypeListMock = fetchTypeList as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;

function renderFilter(selected: string[] = [], onChange = jest.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <TypeFilter selected={selected} onChange={onChange} />
    </QueryClientProvider>,
  );
  return onChange;
}

describe("TypeFilter", () => {
  beforeEach(() => jest.clearAllMocks());

  it("lists the fetched types with localized names", async () => {
    fetchTypeListMock.mockResolvedValue({
      results: [{ name: "fire", url: "" }],
    });
    fetchTypeMock.mockResolvedValue({
      names: [{ name: "Fire", language: { name: "en", url: "" } }],
    });
    renderFilter();
    await userEvent.click(screen.getByRole("combobox"));
    expect(await screen.findByRole("option", { name: /Fire/ })).toBeInTheDocument();
  });

  it("keeps the control usable with the current selection on error", async () => {
    fetchTypeListMock.mockRejectedValue(new Error("boom"));
    const onChange = renderFilter(["fire"]);
    await userEvent.click(await screen.findByRole("button", { name: "Clear all" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
