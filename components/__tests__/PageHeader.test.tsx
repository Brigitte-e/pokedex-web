import { render, screen } from "@testing-library/react";
import { PageHeader } from "../PageHeader";

let mockLang = "en";
jest.mock("next/navigation", () => ({ useParams: () => ({ lang: mockLang }) }));

describe("PageHeader", () => {
  beforeEach(() => {
    mockLang = "en";
  });

  it("renders the localized title as a heading", () => {
    render(<PageHeader titleKey="pages.pokedex.title" />);
    expect(screen.getByRole("heading", { level: 1, name: "Pokémon" })).toBeInTheDocument();
  });

  it("renders the localized subtitle when provided", () => {
    render(
      <PageHeader
        titleKey="pages.items.title"
        subtitleKey="pages.items.subtitle"
        subtitleParams={{ count: 42 }}
      />,
    );
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it("translates for the given locale", () => {
    mockLang = "de";
    render(<PageHeader titleKey="pages.favorites.title" />);
    expect(screen.getByRole("heading", { level: 1, name: "Favoriten" })).toBeInTheDocument();
  });

  it("renders a back link when backHref is provided", () => {
    render(<PageHeader backHref="/en/pokemon" />);
    const link = screen.getByRole("link", { name: /Back/ });
    expect(link).toHaveAttribute("href", "/en/pokemon");
  });

  it("localizes the back link label", () => {
    mockLang = "de";
    render(<PageHeader backHref="/de/pokemon" />);
    expect(screen.getByRole("link", { name: /Zurück/ })).toHaveAttribute(
      "href",
      "/de/pokemon",
    );
  });

  it("omits the back link without backHref", () => {
    render(<PageHeader titleKey="pages.pokedex.title" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("omits the heading without a titleKey", () => {
    render(<PageHeader backHref="/en/types" />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders the right slot content", () => {
    render(
      <PageHeader titleKey="pages.pokedex.title" rightSlot={<button>Action</button>} />,
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
