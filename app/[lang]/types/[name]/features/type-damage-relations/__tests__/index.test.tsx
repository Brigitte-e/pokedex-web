import { render, screen } from "@testing-library/react";
import { TypeDamageRelations } from "../index";
import type { PokemonType } from "@/types";

jest.mock("next/navigation", () => ({ useParams: () => ({ lang: "en" }) }));

const type = {
  name: "fire",
  names: [],
  damage_relations: {
    double_damage_to: [{ name: "grass", url: "" }],
    double_damage_from: [{ name: "water", url: "" }],
    half_damage_to: [],
    half_damage_from: [],
    no_damage_to: [],
    no_damage_from: [],
  },
  moves: [],
} as unknown as PokemonType;

describe("TypeDamageRelations", () => {
  function renderRelations(typeNameMap: Record<string, string> = { grass: "Grass" }) {
    render(
      <TypeDamageRelations type={type} typeNameMap={typeNameMap} />,
    );
  }

  it("renders the section title and relation labels", () => {
    renderRelations();
    expect(screen.getByRole("heading", { name: "Damage Relations" })).toBeInTheDocument();
    expect(screen.getByText("Strong against (2×)")).toBeInTheDocument();
  });

  it("links related types to their detail pages using the localized name", () => {
    renderRelations();
    const link = screen.getByRole("link", { name: "Grass" });
    expect(link).toHaveAttribute("href", "/en/types/grass");
  });

  it("falls back to the slug when no localized name is mapped", () => {
    render(
      <TypeDamageRelations type={type} typeNameMap={{}} />,
    );
    expect(screen.getByRole("link", { name: "water" })).toBeInTheDocument();
  });

  it("shows the empty label for relations without types", () => {
    renderRelations();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });
});
