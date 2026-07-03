import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "../error";

let mockLang = "en";
jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: mockLang }),
}));

describe("error page", () => {
  beforeEach(() => {
    mockLang = "en";
  });

  it("renders the localized error message", () => {
    render(<ErrorPage error={new Error("boom")} reset={jest.fn()} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders German messages for the de locale", () => {
    mockLang = "de";
    render(<ErrorPage error={new Error("boom")} reset={jest.fn()} />);
    expect(screen.getByText("Etwas ist schiefgelaufen.")).toBeInTheDocument();
  });

  it("falls back to English for unknown locales", () => {
    mockLang = "fr";
    render(<ErrorPage error={new Error("boom")} reset={jest.fn()} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("calls reset when the retry button is clicked", async () => {
    const reset = jest.fn();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalled();
  });
});
