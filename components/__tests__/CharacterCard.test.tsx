import { render, screen } from "@testing-library/react";
import { CharacterCard } from "../CharacterCard";

jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe("CharacterCard", () => {
  it("renders the localized display name when provided", () => {
    render(<CharacterCard id={25} name="pikachu" displayName="Pikachu" />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("renders the sprite image", () => {
    render(<CharacterCard id={25} name="pikachu" displayName="Pikachu" />);
    const img = screen.getByRole("img", { name: "Pikachu" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("25"));
  });

  it("renders type badges when types are provided", () => {
    render(<CharacterCard id={25} name="pikachu" types={["electric"]} />);
    expect(screen.getByText("electric")).toBeInTheDocument();
  });

  it("does not flash an English fallback while localized names are loading", () => {
    render(<CharacterCard id={25} name="pikachu" />);
    expect(screen.queryByText("Pikachu")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});
