import { render, screen } from "@testing-library/react";
import { TypeGrid } from "../index";
import { TYPE_COLORS } from "@/lib/constants";
import type { PokemonType } from "@/types";

const types = [
  { name: "fire", names: [{ name: "Feuer", language: { name: "de", url: "" } }] },
  { name: "water", names: [] },
] as unknown as PokemonType[];

describe("TypeGrid", () => {
  it("links each type to its detail page", () => {
    render(<TypeGrid types={types} locale="en" />);
    expect(screen.getByRole("link", { name: "Fire" })).toHaveAttribute("href", "/en/types/fire");
    expect(screen.getByRole("link", { name: "Water" })).toHaveAttribute("href", "/en/types/water");
  });

  it("shows localized names for the active locale", () => {
    render(<TypeGrid types={types} locale="de" />);
    expect(screen.getByRole("link", { name: "Feuer" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Water" })).toBeInTheDocument();
  });

  it("colors each tile with its type color", () => {
    render(<TypeGrid types={types} locale="en" />);
    expect(screen.getByRole("link", { name: "Fire" })).toHaveStyle({
      backgroundColor: TYPE_COLORS.fire,
    });
  });
});
