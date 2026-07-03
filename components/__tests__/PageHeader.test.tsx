import { render, screen } from "@testing-library/react";
import { PageHeader } from "../PageHeader";

describe("PageHeader", () => {
  it("renders the title as a heading", () => {
    render(<PageHeader title="Pokédex" />);
    expect(screen.getByRole("heading", { level: 1, name: "Pokédex" })).toBeInTheDocument();
  });

  it("renders the subtitle when provided", () => {
    render(<PageHeader title="Pokédex" subtitle="Browse all Pokémon" />);
    expect(screen.getByText("Browse all Pokémon")).toBeInTheDocument();
  });

  it("renders a back link when backHref is provided", () => {
    render(<PageHeader title="Pikachu" backHref="/en/pokemon" backLabel="Back to Pokédex" />);
    const link = screen.getByRole("link", { name: /Back to Pokédex/ });
    expect(link).toHaveAttribute("href", "/en/pokemon");
  });

  it("omits the back link without backHref", () => {
    render(<PageHeader title="Pokédex" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the right slot content", () => {
    render(<PageHeader title="Pokédex" rightSlot={<button>Action</button>} />);
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
