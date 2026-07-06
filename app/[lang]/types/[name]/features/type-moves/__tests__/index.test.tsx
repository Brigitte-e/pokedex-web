import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TypeMoves } from "../index";

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
  { name: "ember", url: "" },
  { name: "fire-blast", url: "" },
];

describe("TypeMoves", () => {
  beforeEach(() => {
    mockLang = "en";
  });

  it("renders nothing when there are no moves", () => {
    const { container } = render(<TypeMoves moves={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the localized title and one button per move", () => {
    render(<TypeMoves moves={moves} />);
    expect(screen.getByRole("heading", { name: "Moves" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fire Blast" })).toBeInTheDocument();
  });

  it("translates the title for the given locale", () => {
    mockLang = "de";
    render(<TypeMoves moves={moves} />);
    expect(screen.getByRole("heading", { name: "Attacken" })).toBeInTheDocument();
  });

  it("opens and closes the move modal", async () => {
    render(<TypeMoves moves={moves} />);
    await userEvent.click(screen.getByRole("button", { name: "Ember" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("ember");
    await userEvent.click(screen.getByText("close-modal"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
