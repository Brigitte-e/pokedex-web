import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it("applies secondary variant by default", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test")).toHaveClass("bg-secondary");
  });

  it("applies outline variant classes", () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline")).toHaveClass("text-foreground");
  });

  it("merges custom className", () => {
    render(<Badge className="custom-class">Item</Badge>);
    expect(screen.getByText("Item")).toHaveClass("custom-class");
  });
});
