import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../Pagination";

const defaultProps = {
  page: 2,
  totalPages: 5,
  hasPrevious: true,
  hasNext: true,
  onPrevious: jest.fn(),
  onNext: jest.fn(),
};

describe("Pagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays current page and total pages", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("calls onPrevious when Previous is clicked", async () => {
    render(<Pagination {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when Next is clicked", async () => {
    render(<Pagination {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it("disables Previous button when hasPrevious is false", () => {
    render(<Pagination {...defaultProps} hasPrevious={false} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("disables Next button when hasNext is false", () => {
    render(<Pagination {...defaultProps} hasNext={false} />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
