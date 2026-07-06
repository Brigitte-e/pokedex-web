import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClearFavoritesButton } from "../ClearFavoritesButton";

jest.mock("next/navigation", () => ({ useParams: () => ({ lang: "en" }) }));

const defaultProps = {
  onClear: jest.fn(),
};

describe("ClearFavoritesButton", () => {
  beforeEach(() => {
    defaultProps.onClear.mockClear();
  });

  it("falls back to default labels when none are provided", async () => {
    render(<ClearFavoritesButton onClear={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear all favorites" }));
    expect(
      screen.getByText("Do you really want to remove all pokemon from favorites?"),
    ).toBeInTheDocument();
  });

  it("opens a confirmation dialog on click", async () => {
    render(<ClearFavoritesButton {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear all favorites" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText("Do you really want to remove all pokemon from favorites?"),
    ).toBeInTheDocument();
    expect(defaultProps.onClear).not.toHaveBeenCalled();
  });

  it("calls onClear and closes the dialog on confirm", async () => {
    render(<ClearFavoritesButton {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear all favorites" }));
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not clear when cancelled", async () => {
    render(<ClearFavoritesButton {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear all favorites" }));
    // Both the footer cancel and the X close button share the "Cancel" label.
    const [cancelButton] = screen.getAllByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);
    expect(defaultProps.onClear).not.toHaveBeenCalled();
  });
});
