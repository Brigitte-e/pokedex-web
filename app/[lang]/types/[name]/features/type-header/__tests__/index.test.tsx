import { render, screen } from "@testing-library/react";
import { TypeHeader } from "../index";
import { TYPE_COLORS, DEFAULT_TYPE_COLOR } from "@/lib/constants";

describe("TypeHeader", () => {
  it("renders the localized type name as a heading", () => {
    render(<TypeHeader name="fire" localizedName="Feuer" />);
    expect(screen.getByRole("heading", { level: 1, name: "Feuer" })).toBeInTheDocument();
  });

  it("uses the type color as background", () => {
    const { container } = render(<TypeHeader name="fire" localizedName="Fire" />);
    expect(container.firstChild).toHaveStyle({ backgroundColor: TYPE_COLORS.fire });
  });

  it("falls back to the default color for unknown types", () => {
    const { container } = render(<TypeHeader name="mystery" localizedName="Mystery" />);
    expect(container.firstChild).toHaveStyle({ backgroundColor: DEFAULT_TYPE_COLOR });
  });
});
