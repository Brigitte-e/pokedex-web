import { render, screen } from "@testing-library/react";
import { CharacterCard } from "../CharacterCard";

jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "Link";
  return MockLink;
});

describe("CharacterCard", () => {
  it("renders the localized display name when provided", () => {
    render(
      <CharacterCard id={25} name="pikachu" displayName="Pikachu" locale="en" />,
    );
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("renders the sprite image", () => {
    render(<CharacterCard id={25} name="pikachu" locale="en" />);
    const img = screen.getByRole("img", { name: "Pikachu" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("25"));
  });

  it("renders type badges when types are provided", () => {
    render(<CharacterCard id={25} name="pikachu" types={["electric"]} locale="en" />);
    expect(screen.getByText("electric")).toBeInTheDocument();
  });

  it("links to the correct Pokémon page", () => {
    render(<CharacterCard id={25} name="pikachu" locale="en" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/pokemon/pikachu");
  });

  it("does not flash an English fallback while localized names are loading", () => {
    render(<CharacterCard id={25} name="pikachu" locale="de" />);
    expect(screen.queryByText("Pikachu")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});
