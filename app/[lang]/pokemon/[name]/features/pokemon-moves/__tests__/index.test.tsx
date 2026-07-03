import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonMoves } from "../index";
import type { MoveModalLabels } from "@/components/MoveModal";

jest.mock("@/components/MoveModal", () => ({
  MoveModal: ({ moveName, onClose }: { moveName: string; onClose: () => void }) => (
    <div role="dialog">
      {moveName}
      <button onClick={onClose}>close-modal</button>
    </div>
  ),
}));

const labels = {} as MoveModalLabels;
const moves = [
  { move: { name: "thunderbolt", url: "" }, version_group_details: [] },
  { move: { name: "quick-attack", url: "" }, version_group_details: [] },
];

describe("PokemonMoves", () => {
  it("renders the title and one badge per move", () => {
    render(<PokemonMoves moves={moves} title="Moves (2)" moveModalLabels={labels} />);
    expect(screen.getByRole("heading", { name: "Moves (2)" })).toBeInTheDocument();
    expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
    expect(screen.getByText("Quick Attack")).toBeInTheDocument();
  });

  it("opens the move modal when a move is clicked", async () => {
    render(<PokemonMoves moves={moves} title="Moves" moveModalLabels={labels} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("Thunderbolt"));
    expect(screen.getByRole("dialog")).toHaveTextContent("thunderbolt");
  });

  it("closes the modal via onClose", async () => {
    render(<PokemonMoves moves={moves} title="Moves" moveModalLabels={labels} />);
    await userEvent.click(screen.getByText("Thunderbolt"));
    await userEvent.click(screen.getByText("close-modal"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
