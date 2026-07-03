import { render, screen } from "@testing-library/react";
import LoginPage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("../LoginForm", () => ({
  LoginForm: ({ lang, labels }: { lang: string; labels: { signIn: string } }) => (
    <div data-testid="login-form">
      {lang}|{labels.signIn}
    </div>
  ),
}));

describe("LoginPage", () => {
  it("renders the login form with the auth dictionary", async () => {
    render(await LoginPage({ params: Promise.resolve({ lang: "en" }) }));
    expect(screen.getByTestId("login-form")).toHaveTextContent("en|Sign in");
  });
});
