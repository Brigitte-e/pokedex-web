import { render, screen } from "@testing-library/react";
import { LoadingState } from "../LoadingState";

describe("LoadingState", () => {
  it("renders inline text by default", () => {
    render(<LoadingState />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders skeleton grid for grid variant", () => {
    const { container } = render(<LoadingState variant="grid" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders skeleton for detail variant", () => {
    const { container } = render(<LoadingState variant="detail" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders a custom loading text inline", () => {
    render(<LoadingState loadingText="Bitte warten…" />);
    expect(screen.getByText("Bitte warten…")).toBeInTheDocument();
  });

  it.each(["item-list", "move-list", "type-grid", "type-detail"] as const)(
    "renders skeletons for the %s variant",
    (variant) => {
      const { container } = render(<LoadingState variant={variant} />);
      expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    },
  );

  it("reserves the type badge row in the grid variant", () => {
    const { container } = render(<LoadingState variant="grid" showTypeBadges />);
    const withBadges = container.querySelectorAll(".animate-pulse").length;
    const { container: plain } = render(<LoadingState variant="grid" />);
    expect(withBadges).toBeGreaterThan(plain.querySelectorAll(".animate-pulse").length);
  });
});
