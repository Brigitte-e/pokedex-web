import { render, screen } from "@testing-library/react";
import { PokemonStats } from "../index";
import { STAT_MAX } from "@/lib/constants";

let mockLang = "en";
jest.mock("next/navigation", () => ({ useParams: () => ({ lang: mockLang }) }));

const stats = [
  { base_stat: 35, effort: 0, stat: { name: "hp", url: "" } },
  { base_stat: 90, effort: 2, stat: { name: "speed", url: "" } },
];

describe("PokemonStats", () => {
  beforeEach(() => {
    mockLang = "en";
  });

  it("renders the localized section title", () => {
    render(<PokemonStats stats={stats} />);
    expect(screen.getByRole("heading", { name: "Base Stats" })).toBeInTheDocument();
  });

  it("renders each stat with its value", () => {
    render(<PokemonStats stats={stats} />);
    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
  });

  it("localizes stat names for the given locale", () => {
    mockLang = "de";
    render(<PokemonStats stats={stats} />);
    expect(screen.getByRole("heading", { name: "Basiswerte" })).toBeInTheDocument();
    expect(screen.getByText("KP")).toBeInTheDocument();
    expect(screen.getByText("Initiative")).toBeInTheDocument();
  });

  it("capitalizes stat slugs missing from the dictionary", () => {
    render(
      <PokemonStats stats={[{ base_stat: 10, stat: { name: "unknown-stat", url: "" } }]} />,
    );
    expect(screen.getByText("Unknown Stat")).toBeInTheDocument();
  });

  it("sizes the bar relative to the stat maximum", () => {
    const { container } = render(<PokemonStats stats={stats} />);
    const bars = container.querySelectorAll(".bg-pk-yellow");
    expect(bars[0]).toHaveStyle({ width: `${(35 / STAT_MAX) * 100}%` });
  });
});
