import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteCard } from "../FavoriteCard";

jest.mock("@/components/LazyImage", () => ({
  LazyImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const defaultProps = {
  id: 25,
  name: "pikachu",
  locale: "en" as const,
  onRemove: jest.fn(),
  removeLabel: "Remove from favorites",
  confirmRemove: "Do you really want to remove this pokemon from favorites?",
  confirmRemoveCancel: "Cancel",
  confirmRemoveConfirm: "Remove",
};

describe("FavoriteCard", () => {
  beforeEach(() => {
    defaultProps.onRemove.mockClear();
  });

  it("renders the pokemon card", () => {
    render(<FavoriteCard {...defaultProps} />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("falls back to default labels when none are provided", async () => {
    render(<FavoriteCard id={25} name="pikachu" locale="en" onRemove={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove from favorites" }));
    expect(
      screen.getByText("Do you really want to remove this pokemon from favorites?"),
    ).toBeInTheDocument();
  });

  it("opens a confirmation dialog when remove is clicked", async () => {
    render(<FavoriteCard {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove from favorites" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText("Do you really want to remove this pokemon from favorites?"),
    ).toBeInTheDocument();
    expect(defaultProps.onRemove).not.toHaveBeenCalled();
  });

  it("calls onRemove and closes the dialog on confirm", async () => {
    render(<FavoriteCard {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove from favorites" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not remove when cancelled", async () => {
    render(<FavoriteCard {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove from favorites" }));
    // Both the footer cancel and the X close button share the "Cancel" label.
    const [cancelButton] = screen.getAllByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);
    expect(defaultProps.onRemove).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
