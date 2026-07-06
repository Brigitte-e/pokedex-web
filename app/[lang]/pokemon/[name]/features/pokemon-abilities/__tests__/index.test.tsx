import { render, screen } from "@testing-library/react";
import { PokemonAbilities } from "../index";

let mockLang = "en";
jest.mock("next/navigation", () => ({ useParams: () => ({ lang: mockLang }) }));

const abilities = [
  { ability: { name: "static", url: "" }, is_hidden: false, slot: 1 },
  {
    ability: { name: "lightning-rod", url: "", localizedName: "Blitzfänger" },
    is_hidden: true,
    slot: 3,
  },
];

describe("PokemonAbilities", () => {
  beforeEach(() => {
    mockLang = "en";
  });

  it("renders the localized section title", () => {
    render(<PokemonAbilities abilities={abilities} />);
    expect(screen.getByRole("heading", { name: "Abilities" })).toBeInTheDocument();
  });

  it("translates the title for the given locale", () => {
    mockLang = "de";
    render(<PokemonAbilities abilities={abilities} />);
    expect(screen.getByRole("heading", { name: "Fähigkeiten" })).toBeInTheDocument();
  });

  it("capitalizes ability slugs without a localized name", () => {
    render(<PokemonAbilities abilities={abilities} />);
    expect(screen.getByText("Static")).toBeInTheDocument();
  });

  it("prefers the localized ability name", () => {
    render(<PokemonAbilities abilities={abilities} />);
    expect(screen.getByText("Blitzfänger")).toBeInTheDocument();
    expect(screen.queryByText("Lightning Rod")).not.toBeInTheDocument();
  });

  it("marks hidden abilities", () => {
    render(<PokemonAbilities abilities={abilities} />);
    expect(screen.getByText("(hidden)")).toBeInTheDocument();
  });
});
