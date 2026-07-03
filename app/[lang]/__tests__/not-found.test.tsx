import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

let mockParams: { lang?: string } | null = { lang: "en" };
jest.mock("next/navigation", () => ({
  useParams: () => mockParams,
}));

describe("not-found page", () => {
  it("renders the 404 message with a link home", () => {
    mockParams = { lang: "en" };
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Pokédex" })).toHaveAttribute(
      "href",
      "/en/pokemon",
    );
  });

  it("renders localized messages for a known locale", () => {
    mockParams = { lang: "es" };
    render(<NotFound />);
    expect(screen.getByText("Página no encontrada.")).toBeInTheDocument();
  });

  it("falls back to the default locale without params", () => {
    mockParams = null;
    render(<NotFound />);
    expect(screen.getByText("Page not found.")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/pokemon");
  });
});
