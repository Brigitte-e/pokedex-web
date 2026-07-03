import { render, screen } from "@testing-library/react";
import { PokemonStats } from "../index";
import { STAT_MAX } from "@/lib/constants";

const stats = [
  { base_stat: 35, effort: 0, stat: { name: "hp", url: "" } },
  { base_stat: 90, effort: 2, stat: { name: "speed", url: "" } },
];

describe("PokemonStats", () => {
  it("renders the section title", () => {
    render(<PokemonStats stats={stats} title="Base Stats" />);
    expect(screen.getByRole("heading", { name: "Base Stats" })).toBeInTheDocument();
  });

  it("renders each stat with its value", () => {
    render(<PokemonStats stats={stats} title="Base Stats" />);
    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
  });

  it("uses localized stat names when provided", () => {
    render(<PokemonStats stats={stats} title="Base Stats" statNames={{ hp: "KP" }} />);
    expect(screen.getByText("KP")).toBeInTheDocument();
    expect(screen.getByText("Speed")).toBeInTheDocument();
  });

  it("sizes the bar relative to the stat maximum", () => {
    const { container } = render(<PokemonStats stats={stats} title="Base Stats" />);
    const bars = container.querySelectorAll(".bg-pk-yellow");
    expect(bars[0]).toHaveStyle({ width: `${(35 / STAT_MAX) * 100}%` });
  });
});
