import { render, screen } from "@testing-library/react";
import { LoadingState } from "../LoadingState";
import { t } from "@/lib/i18n";

describe("LoadingState", () => {
  it("renders inline text by default", () => {
    render(<LoadingState />);
    expect(screen.getByText(t("common.loading"))).toBeInTheDocument();
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
});
