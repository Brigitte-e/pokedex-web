import { render, screen } from "@testing-library/react";
import { ErrorState } from "../ErrorState";
import { t } from "@/lib/i18n";

describe("ErrorState", () => {
  it("renders default message", () => {
    render(<ErrorState />);
    expect(screen.getByText(t("common.errorDefault"))).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<ErrorState message="Character not found" />);
    expect(screen.getByText("Character not found")).toBeInTheDocument();
  });

  it("has alert role for accessibility", () => {
    render(<ErrorState />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
