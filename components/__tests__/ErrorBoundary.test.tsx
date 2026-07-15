import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

const ThrowingChild = () => {
  throw new Error("boom");
};

describe("ErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary fallback={(error) => <p>{error.message}</p>}>
        <p>content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders the fallback with the caught error when a child throws", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={(error) => <p>{error.message}</p>}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("boom")).toBeInTheDocument();
    (console.error as jest.Mock).mockRestore();
  });
});
