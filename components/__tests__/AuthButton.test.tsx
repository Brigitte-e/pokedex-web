import { render, screen } from "@testing-library/react";
import { AuthButton } from "../AuthButton";
import { useAuthStore } from "@/store/auth";
import type { User } from "firebase/auth";

const defaultProps = { locale: "en", loginLabel: "Log in", profileLabel: "Profile" };

describe("AuthButton", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: false });
  });

  it("renders a placeholder while auth is loading", () => {
    useAuthStore.setState({ user: null, loading: true });
    const { container } = render(<AuthButton {...defaultProps} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders a login link when signed out", () => {
    render(<AuthButton {...defaultProps} />);
    const link = screen.getByRole("link", { name: "Log in" });
    expect(link).toHaveAttribute("href", "/en/login");
  });

  it("renders a profile link with initials when signed in", () => {
    useAuthStore.setState({
      user: { displayName: "Ash Ketchum", email: "ash@example.com", photoURL: null } as User,
      loading: false,
    });
    render(<AuthButton {...defaultProps} />);
    const link = screen.getByRole("link", { name: "Profile" });
    expect(link).toHaveAttribute("href", "/en/profile");
    expect(link).toHaveTextContent("AK");
  });

  it("falls back to the email initial without a display name", () => {
    useAuthStore.setState({
      user: { displayName: null, email: "misty@example.com", photoURL: null } as User,
      loading: false,
    });
    render(<AuthButton {...defaultProps} />);
    expect(screen.getByRole("link", { name: "Profile" })).toHaveTextContent("M");
  });

  it("renders the avatar image when a photo is available", () => {
    useAuthStore.setState({
      user: {
        displayName: "Ash Ketchum",
        email: "ash@example.com",
        photoURL: "https://example.com/avatar.png",
      } as User,
      loading: false,
    });
    render(<AuthButton {...defaultProps} />);
    expect(screen.getByRole("img", { name: "Ash Ketchum" })).toHaveAttribute(
      "src",
      "https://example.com/avatar.png",
    );
  });
});
