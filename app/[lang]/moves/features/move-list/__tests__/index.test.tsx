import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoveList } from "../index";
import { fetchMove } from "@/lib/api/moves";
import type { MoveModalLabels } from "@/components/MoveModal";

jest.mock("@/lib/api/moves", () => ({ fetchMove: jest.fn() }));
jest.mock("../MoveListClient", () => ({
  MoveListClient: ({ locale }: { locale: string }) => (
    <div data-testid="move-list-client">{locale}</div>
  ),
}));

const fetchMoveMock = fetchMove as jest.Mock;

const props = {
  list: {
    count: 2,
    next: null,
    previous: null,
    results: [
      { name: "thunderbolt", url: "" },
      { name: "ember", url: "" },
    ],
  },
  initialPage: 1,
  moveModalLabels: {} as MoveModalLabels,
  listLabels: {
    previous: "Prev",
    next: "Next",
    pageOfTotalPattern: "{page}/{total}",
    pagination: "Pagination",
    loading: "Loading…",
    errorDefault: "Error",
  },
};

async function renderList(locale?: "en" | "de") {
  const ui = await MoveList({ ...props, locale });
  render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
}

describe("MoveList (server wrapper)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMoveMock.mockResolvedValue({ id: 1, name: "thunderbolt" });
  });

  it("hydrates the client without move prefetches for the default locale", async () => {
    await renderList();
    expect(screen.getByTestId("move-list-client")).toHaveTextContent("en");
    expect(fetchMoveMock).not.toHaveBeenCalled();
  });

  it("prefetches move details for non-default locales, ignoring failures", async () => {
    fetchMoveMock
      .mockResolvedValueOnce({ id: 1, name: "thunderbolt" })
      .mockRejectedValueOnce(new Error("boom"));
    await renderList("de");
    expect(fetchMoveMock).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("move-list-client")).toHaveTextContent("de");
  });
});
