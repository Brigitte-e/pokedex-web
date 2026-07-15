import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PokemonMoves } from "../index";
import { fetchMove } from "@/lib/api/moves";
import { capitalize } from "@/lib/pokeapi";

let mockLang = "en";
jest.mock("next/navigation", () => ({ useParams: () => ({ lang: mockLang }) }));

jest.mock("@/lib/api/moves", () => ({ fetchMove: jest.fn() }));

jest.mock("@/components/MoveModal", () => ({
  MoveModal: ({ moveName, onClose }: { moveName: string; onClose: () => void }) => (
    <div role="dialog">
      {moveName}
      <button onClick={onClose}>close-modal</button>
    </div>
  ),
}));

const fetchMoveMock = fetchMove as jest.Mock;

const moves = [
  { move: { name: "ember", url: "" }, version_group_details: [] },
  { move: { name: "fire-blast", url: "" }, version_group_details: [] },
];

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("PokemonMoves", () => {
  beforeEach(() => {
    mockLang = "en";
    jest.clearAllMocks();
    fetchMoveMock.mockReturnValue(new Promise(() => {}));
  });

  it("renders the localized title with a loading skeleton per move while names load", () => {
    const { container } = renderWithClient(<PokemonMoves moves={moves} />);
    expect(screen.getByRole("heading", { name: "Moves (2)" })).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(moves.length);
  });

  it("translates the title for the given locale", () => {
    mockLang = "de";
    renderWithClient(<PokemonMoves moves={moves} />);
    expect(screen.getByRole("heading", { name: "Attacken (2)" })).toBeInTheDocument();
  });

  it("shows the localized move name once it loads", async () => {
    fetchMoveMock.mockResolvedValue({
      name: "ember",
      names: [
        { name: "Ember", language: { name: "en", url: "" } },
        { name: "Flammenwurf", language: { name: "de", url: "" } },
      ],
    });
    mockLang = "de";
    renderWithClient(<PokemonMoves moves={[moves[0]]} />);
    expect(await screen.findByRole("button", { name: "Flammenwurf" })).toBeInTheDocument();
  });

  it("opens and closes the move modal", async () => {
    fetchMoveMock.mockImplementation((name: string) =>
      Promise.resolve({
        name,
        names: [{ name: capitalize(name), language: { name: "en", url: "" } }],
      })
    );
    renderWithClient(<PokemonMoves moves={moves} />);
    await userEvent.click(await screen.findByRole("button", { name: "Ember" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("ember");
    await userEvent.click(screen.getByText("close-modal"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an empty move list section", () => {
    renderWithClient(<PokemonMoves moves={[]} />);
    expect(screen.getByRole("heading", { name: "Moves (0)" })).toBeInTheDocument();
  });
});
