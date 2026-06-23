import { render, screen } from "@testing-library/react";
import { DetailSection } from "../DetailSection";

describe("DetailSection", () => {
  it("renders the section title", () => {
    render(<DetailSection title="TV Shows" items={[]} />);
    expect(screen.getByText("TV Shows")).toBeInTheDocument();
  });

  it("renders each item as a badge", () => {
    render(<DetailSection title="Abilities" items={["overgrow", "chlorophyll"]} />);
    expect(screen.getByText("overgrow")).toBeInTheDocument();
    expect(screen.getByText("chlorophyll")).toBeInTheDocument();
  });

  it("renders an em dash when items is empty", () => {
    render(<DetailSection title="Films" items={[]} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
