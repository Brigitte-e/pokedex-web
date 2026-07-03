import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemModal, type ItemModalLabels } from "../ItemModal";
import { fetchItem } from "@/lib/api/items";
import { fetchItemCategory } from "@/lib/api/categories";
import type { Item, ItemCategory } from "@/types/item";

jest.mock("@/lib/api/items", () => ({ fetchItem: jest.fn() }));
jest.mock("@/lib/api/categories", () => ({ fetchItemCategory: jest.fn() }));
jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const fetchItemMock = fetchItem as jest.Mock;
const fetchCategoryMock = fetchItemCategory as jest.Mock;

const labels: ItemModalLabels = {
  cost: "Cost",
  category: "Category",
  noDescription: "No description available.",
  errorDefault: "Something went wrong",
  empty: "—",
  close: "Close",
};

const item: Item = {
  id: 4,
  name: "poke-ball",
  cost: 200,
  category: { name: "standard-balls", url: "" },
  names: [{ name: "Poké Ball", language: { name: "en", url: "" } }],
  effect_entries: [
    { effect: "Catches pokemon.", short_effect: "Catches pokemon.", language: { name: "en", url: "" } },
  ],
  flavor_text_entries: [],
  sprites: { default: "/poke-ball.png" },
};

const category: ItemCategory = {
  id: 34,
  name: "standard-balls",
  names: [{ name: "Standard balls", language: { name: "en", url: "" } }],
};

function renderModal(onClose = jest.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <ItemModal itemName="poke-ball" onClose={onClose} labels={labels} />
    </QueryClientProvider>,
  );
  return onClose;
}

describe("ItemModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchItemMock.mockResolvedValue(item);
    fetchCategoryMock.mockResolvedValue(category);
  });

  it("shows skeletons while loading", () => {
    fetchItemMock.mockReturnValue(new Promise(() => {}));
    renderModal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText("Poké Ball")).not.toBeInTheDocument();
  });

  it("renders item details on success", async () => {
    renderModal();
    expect(await screen.findByText("Poké Ball")).toBeInTheDocument();
    expect(screen.getByText("Catches pokemon.")).toBeInTheDocument();
    expect(screen.getByText("₽200")).toBeInTheDocument();
    expect(await screen.findAllByText("Standard balls")).not.toHaveLength(0);
  });

  it("renders the fallback text when the item has no description", async () => {
    fetchItemMock.mockResolvedValue({ ...item, effect_entries: [], flavor_text_entries: [] });
    renderModal();
    expect(await screen.findByText("No description available.")).toBeInTheDocument();
  });

  it("renders an error message when the request fails", async () => {
    fetchItemMock.mockRejectedValue(new Error("boom"));
    renderModal();
    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  it("calls onClose when the dialog is dismissed", async () => {
    const onClose = renderModal();
    await screen.findByText("Poké Ball");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });
});
