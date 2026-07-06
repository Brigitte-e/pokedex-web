import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonMoves } from "../index";

let mockLang = "en";
jest.mock("next/navigation", () => ({ useParams: () => ({ lang: mockLang }) }));

jest.mock("@/components/MoveModal", () => ({
  MoveModal: ({ moveName, onClose }: { moveName: string; onClose: () => void }) => (
    <div role="dialog">
      {moveName}
      <button onClick={onClose}>close-modal</button>
    </div>
  ),
}));

const moves = [
  { move: { name: "ember", url: "" }, version_group_details: [] },
  { move: { name: "fire-blast", url: "" }, version_group_details: [] },
];

describe("PokemonMoves", () => {
  beforeEach(() => {
    mockLang = "en";
  });

  it("renders the localized title with the move count and one button per move", () => {
    render(<PokemonMoves moves={moves} />);
    expect(screen.getByRole("heading", { name: "Moves (2)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fire Blast" })).toBeInTheDocument();
  });

  it("translates the title for the given locale", () => {
    mockLang = "de";
    render(<PokemonMoves moves={moves} />);
    expect(screen.getByRole("heading", { name: "Attacken (2)" })).toBeInTheDocument();
  });

  it("opens and closes the move modal", async () => {
    render(<PokemonMoves moves={moves} />);
    await userEvent.click(screen.getByRole("button", { name: "Ember" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("ember");
    await userEvent.click(screen.getByText("close-modal"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an empty move list section", () => {
    render(<PokemonMoves moves={[]} />);
    expect(screen.getByRole("heading", { name: "Moves (0)" })).toBeInTheDocument();
  });
});
