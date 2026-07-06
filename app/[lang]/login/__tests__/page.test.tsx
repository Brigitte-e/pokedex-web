import { render, screen } from "@testing-library/react";
import LoginPage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("../LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form" />,
}));

describe("LoginPage", () => {
  it("renders the login form", async () => {
    render(await LoginPage());
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
