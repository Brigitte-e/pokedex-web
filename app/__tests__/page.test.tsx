import { redirect } from "next/navigation";
import Home from "../page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Home page", () => {
  it("redirects to /pokemon", () => {
    Home();
    expect(redirect).toHaveBeenCalledWith("/pokemon");
  });
});
