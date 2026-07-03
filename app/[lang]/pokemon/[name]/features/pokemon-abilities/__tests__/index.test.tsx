import { render, screen } from "@testing-library/react";
import { PokemonAbilities } from "../index";

const abilities = [
  { ability: { name: "static", url: "" }, is_hidden: false, slot: 1 },
  {
    ability: { name: "lightning-rod", url: "", localizedName: "Blitzfänger" },
    is_hidden: true,
    slot: 3,
  },
];

describe("PokemonAbilities", () => {
  it("renders the section title", () => {
    render(<PokemonAbilities abilities={abilities} title="Abilities" hiddenLabel="(hidden)" />);
    expect(screen.getByRole("heading", { name: "Abilities" })).toBeInTheDocument();
  });

  it("capitalizes ability slugs without a localized name", () => {
    render(<PokemonAbilities abilities={abilities} title="Abilities" hiddenLabel="(hidden)" />);
    expect(screen.getByText("Static")).toBeInTheDocument();
  });

  it("prefers the localized ability name", () => {
    render(<PokemonAbilities abilities={abilities} title="Abilities" hiddenLabel="(hidden)" />);
    expect(screen.getByText("Blitzfänger")).toBeInTheDocument();
    expect(screen.queryByText("Lightning Rod")).not.toBeInTheDocument();
  });

  it("marks hidden abilities", () => {
    render(<PokemonAbilities abilities={abilities} title="Abilities" hiddenLabel="(hidden)" />);
    expect(screen.getByText("(hidden)")).toBeInTheDocument();
  });
});
