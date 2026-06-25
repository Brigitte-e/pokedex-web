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
  it("renders the Pokémon name", () => {
    render(<CharacterCard id={25} name="pikachu" />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("renders the sprite image", () => {
    render(<CharacterCard id={25} name="pikachu" />);
    const img = screen.getByRole("img", { name: "pikachu" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("25"));
  });

  it("renders type badges when types are provided", () => {
    render(<CharacterCard id={25} name="pikachu" types={["electric"]} />);
    expect(screen.getByText("electric")).toBeInTheDocument();
  });

  it("links to the correct Pokémon page", () => {
    render(<CharacterCard id={25} name="pikachu" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/pokemon/pikachu");
  });

  it("renders the padded Pokédex number", () => {
    render(<CharacterCard id={25} name="pikachu" />);
    expect(screen.getByText("#0025")).toBeInTheDocument();
  });
});
