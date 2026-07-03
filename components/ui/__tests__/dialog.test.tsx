import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../dialog";

function renderDialog(onOpenChange = jest.fn()) {
  render(
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent closeLabel="Close">
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>,
  );
  return onOpenChange;
}

describe("Dialog", () => {
  it("renders title and description in an accessible dialog", () => {
    renderDialog();
    const dialog = screen.getByRole("dialog", { name: "Title" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("requests closing via the close button", async () => {
    const onOpenChange = renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("requests closing on Escape", async () => {
    const onOpenChange = renderDialog();
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("labels the close button 'Close' by default", () => {
    render(
      <Dialog open onOpenChange={jest.fn()}>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});
