import { render, screen } from "@testing-library/react";
import ProfilePage from "../page";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("../ProfileClient", () => ({
  ProfileClient: ({ lang, labels }: { lang: string; labels: { signOut: string } }) => (
    <div data-testid="profile">
      {lang}|{labels.signOut}
    </div>
  ),
}));

describe("ProfilePage", () => {
  it("renders the profile client with the profile dictionary", async () => {
    render(await ProfilePage({ params: Promise.resolve({ lang: "en" }) }));
    expect(screen.getByTestId("profile")).toHaveTextContent("en|Sign out");
  });
});
