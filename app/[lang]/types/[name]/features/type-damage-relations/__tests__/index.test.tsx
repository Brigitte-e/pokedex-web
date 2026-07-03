import { render, screen } from "@testing-library/react";
import { TypeDamageRelations } from "../index";
import type { PokemonType } from "@/types";

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

const damageRelationLabels = [
  { key: "double_damage_to", label: "Strong against (2×)" },
  { key: "half_damage_to", label: "Not very effective (½×)" },
];

describe("TypeDamageRelations", () => {
  function renderRelations() {
    render(
      <TypeDamageRelations
        type={type}
        locale="en"
        typeNameMap={{ grass: "Grass" }}
        sectionTitle="Damage Relations"
        damageRelationLabels={damageRelationLabels}
        emptyLabel="—"
      />,
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
      <TypeDamageRelations
        type={type}
        locale="en"
        typeNameMap={{}}
        sectionTitle="Damage Relations"
        damageRelationLabels={[{ key: "double_damage_from", label: "Weak against" }]}
        emptyLabel="—"
      />,
    );
    expect(screen.getByRole("link", { name: "water" })).toBeInTheDocument();
  });

  it("shows the empty label for relations without types", () => {
    renderRelations();
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
