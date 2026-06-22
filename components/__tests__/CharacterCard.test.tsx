import { render, screen } from "@testing-library/react";
import { CharacterCard } from "../CharacterCard";

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "Link";
  return MockLink;
});

describe("CharacterCard", () => {
  it("renders the character name", () => {
    render(<CharacterCard id={1} name="Dipper Pines" />);
    expect(screen.getByText("Dipper Pines")).toBeInTheDocument();
  });

  it("renders an image when imageUrl is provided", () => {
    render(<CharacterCard id={1} name="Dipper" imageUrl="https://example.com/dipper.png" />);
    const img = screen.getByRole("img", { name: "Dipper" });
    expect(img).toHaveAttribute("src", "https://example.com/dipper.png");
  });

  it("renders a fallback avatar when no imageUrl", () => {
    render(<CharacterCard id={2} name="Mabel" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("links to the correct character page", () => {
    render(<CharacterCard id={42} name="Gideon" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/character/42");
  });
});
