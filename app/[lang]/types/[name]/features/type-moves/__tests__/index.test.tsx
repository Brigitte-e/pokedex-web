import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TypeMoves } from "../index";
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
  { name: "ember", url: "" },
  { name: "fire-blast", url: "" },
];

describe("TypeMoves", () => {
  it("renders nothing when there are no moves", () => {
    const { container } = render(<TypeMoves moves={[]} title="Moves" moveModalLabels={labels} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the title with the move count and one button per move", () => {
    render(<TypeMoves moves={moves} title="Moves" moveModalLabels={labels} />);
    expect(screen.getByRole("heading", { name: /Moves\s*\(2\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fire Blast" })).toBeInTheDocument();
  });

  it("opens and closes the move modal", async () => {
    render(<TypeMoves moves={moves} title="Moves" moveModalLabels={labels} />);
    await userEvent.click(screen.getByRole("button", { name: "Ember" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("ember");
    await userEvent.click(screen.getByText("close-modal"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
