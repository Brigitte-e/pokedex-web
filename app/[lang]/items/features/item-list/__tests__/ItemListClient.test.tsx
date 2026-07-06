import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemListClient } from "../ItemListClient";
import { fetchItemList, fetchItem } from "@/lib/api/items";
import { ITEM_LIST_PAGE_SIZE } from "@/lib/constants";

jest.mock("@/lib/api/items", () => ({ fetchItemList: jest.fn(), fetchItem: jest.fn() }));
jest.mock("@/lib/api/categories", () => ({ fetchItemCategory: jest.fn().mockResolvedValue(null) }));
jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/en/items",
  useSearchParams: () => mockSearchParams,
  useParams: () => ({ lang: "en" }),
}));

const fetchItemListMock = fetchItemList as jest.Mock;
const fetchItemMock = fetchItem as jest.Mock;

const list = {
  count: ITEM_LIST_PAGE_SIZE * 3,
  next: "next-url",
  previous: null,
  results: [
    { name: "poke-ball", url: "" },
    { name: "great-ball", url: "" },
  ],
};

function renderList() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <ItemListClient locale="en" />
    </QueryClientProvider>,
  );
}

describe("ItemListClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    window.scrollTo = jest.fn();
    fetchItemListMock.mockResolvedValue(list);
    fetchItemMock.mockImplementation((name: string) =>
      Promise.resolve({
        id: 1,
        name,
        cost: 200,
        category: { name: "standard-balls", url: "" },
        names: [],
        effect_entries: [],
        flavor_text_entries: [],
        sprites: { default: `/${name}.png` },
      }),
    );
  });

  it("shows the loading state first", () => {
    fetchItemListMock.mockReturnValue(new Promise(() => {}));
    renderList();
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders an error message when the list fails to load", async () => {
    fetchItemListMock.mockRejectedValue(new Error("PokeAPI error 500"));
    renderList();
    expect(await screen.findByText("PokeAPI error 500")).toBeInTheDocument();
  });

  it("renders one button per item with its sprite", async () => {
    renderList();
    expect(await screen.findByRole("button", { name: /Poke Ball/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Great Ball/ })).toBeInTheDocument();
    expect(await screen.findByRole("img", { name: "poke-ball" })).toBeInTheDocument();
  });

  it("opens the item modal on click and closes it again", async () => {
    renderList();
    await userEvent.click(await screen.findByRole("button", { name: /Poke Ball/ }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates to the next page through the pagination", async () => {
    renderList();
    await screen.findByRole("button", { name: /Poke Ball/ });
    await userEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(window.location.pathname + window.location.search).toBe("/en/items?page=2");
  });
});
