import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileClient } from "../ProfileClient";
import { useAuthStore } from "@/store/auth";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";

jest.mock("firebase/auth", () => ({ signOut: jest.fn() }));
jest.mock("@/lib/firebase", () => ({ getFirebaseAuth: jest.fn(() => ({})) }));

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

const signOutMock = signOut as jest.Mock;

const labels = {
  fallbackName: "Trainer",
  signOut: "Sign out",
  signOutError: "Sign out failed.",
};

const user = {
  displayName: "Ash Ketchum",
  email: "ash@example.com",
  photoURL: null,
} as User;

describe("ProfileClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user, loading: false });
  });

  it("shows a spinner while auth is loading", () => {
    useAuthStore.setState({ user: null, loading: true });
    const { container } = render(<ProfileClient lang="en" labels={labels} />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to login when signed out", () => {
    useAuthStore.setState({ user: null, loading: false });
    render(<ProfileClient lang="en" labels={labels} />);
    expect(mockReplace).toHaveBeenCalledWith("/en/login");
  });

  it("renders the display name, email and initial avatar", () => {
    render(<ProfileClient lang="en" labels={labels} />);
    expect(screen.getByRole("heading", { name: "Ash Ketchum" })).toBeInTheDocument();
    expect(screen.getByText("ash@example.com")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders the photo avatar when available", () => {
    useAuthStore.setState({
      user: { ...user, photoURL: "https://example.com/avatar.png" } as User,
      loading: false,
    });
    render(<ProfileClient lang="en" labels={labels} />);
    expect(screen.getByRole("img", { name: "Ash Ketchum" })).toHaveAttribute(
      "src",
      "https://example.com/avatar.png",
    );
  });

  it("falls back to email and then the fallback name", () => {
    useAuthStore.setState({
      user: { displayName: null, email: null, photoURL: null } as User,
      loading: false,
    });
    render(<ProfileClient lang="en" labels={labels} />);
    expect(screen.getByRole("heading", { name: "Trainer" })).toBeInTheDocument();
  });

  it("signs out and navigates to the pokedex", async () => {
    signOutMock.mockResolvedValue(undefined);
    render(<ProfileClient lang="en" labels={labels} />);
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(signOutMock).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/en/pokemon");
  });

  it("shows an error message when sign-out fails", async () => {
    signOutMock.mockRejectedValue(new Error("boom"));
    render(<ProfileClient lang="en" labels={labels} />);
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Sign out failed.");
  });
});
