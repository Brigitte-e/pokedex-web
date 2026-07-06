import { render, screen } from "@testing-library/react";
import ProfilePage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("../ProfileClient", () => ({
  ProfileClient: () => <div data-testid="profile" />,
}));

describe("ProfilePage", () => {
  it("renders the profile client", async () => {
    render(await ProfilePage());
    expect(screen.getByTestId("profile")).toBeInTheDocument();
  });
});
