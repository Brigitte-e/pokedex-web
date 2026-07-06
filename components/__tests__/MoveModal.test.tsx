import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoveModal } from "../MoveModal";
import { fetchMove } from "@/lib/api/moves";
import { fetchType } from "@/lib/api/types";
import type { Move } from "@/types/move";

jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en" }),
}));
jest.mock("@/lib/api/moves", () => ({ fetchMove: jest.fn() }));
jest.mock("@/lib/api/types", () => ({ fetchType: jest.fn() }));

const fetchMoveMock = fetchMove as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;

const move: Move = {
  id: 85,
  name: "thunderbolt",
  accuracy: 100,
  power: 90,
  pp: 15,
  type: { name: "electric", url: "" },
  damage_class: { name: "special", url: "" },
  names: [{ name: "Thunderbolt", language: { name: "en", url: "" } }],
  effect_entries: [
    {
      effect: "May paralyze the target.",
      short_effect: "May paralyze the target.",
      language: { name: "en", url: "" },
    },
  ],
  flavor_text_entries: [],
};

function renderModal(onClose = jest.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MoveModal moveName="thunderbolt" onClose={onClose} />
    </QueryClientProvider>,
  );
  return onClose;
}

describe("MoveModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMoveMock.mockResolvedValue(move);
    fetchTypeMock.mockResolvedValue({
      name: "electric",
      names: [{ name: "Electric", language: { name: "en", url: "" } }],
    });
  });

  it("shows skeletons while loading", () => {
    fetchMoveMock.mockReturnValue(new Promise(() => {}));
    renderModal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText("Thunderbolt")).not.toBeInTheDocument();
  });

  it("renders move details on success", async () => {
    renderModal();
    expect(await screen.findByText("Thunderbolt")).toBeInTheDocument();
    expect(screen.getByText("May paralyze the target.")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Special")).toBeInTheDocument();
  });

  it("renders the empty placeholder for moves without power or accuracy", async () => {
    fetchMoveMock.mockResolvedValue({ ...move, power: null, accuracy: null });
    renderModal();
    await screen.findByText("Thunderbolt");
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("renders an error message when the request fails", async () => {
    fetchMoveMock.mockRejectedValue(new Error("boom"));
    renderModal();
    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  it("calls onClose when the dialog is dismissed", async () => {
    const onClose = renderModal();
    await screen.findByText("Thunderbolt");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });
});
