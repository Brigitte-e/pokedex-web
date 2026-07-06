import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";
import { useAuthStore } from "@/store/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import type { User } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));
jest.mock("@/lib/firebase", () => ({ getFirebaseAuth: jest.fn(() => ({})) }));

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useParams: () => ({ lang: "en" }),
}));

const signInMock = signInWithEmailAndPassword as jest.Mock;
const signUpMock = createUserWithEmailAndPassword as jest.Mock;
const resetMock = sendPasswordResetEmail as jest.Mock;
const popupMock = signInWithPopup as jest.Mock;

function renderForm() {
  render(<LoginForm lang="en" />);
}

// Labels are not associated via htmlFor, so query the inputs by id.
const getPasswordInput = () => document.getElementById("password") as HTMLInputElement;
const getConfirmInput = () => document.getElementById("confirmPassword") as HTMLInputElement;

async function switchToSignUp() {
  await userEvent.click(screen.getByRole("button", { name: "Sign up" }));
}

async function switchToForgotPassword() {
  await userEvent.click(screen.getByRole("button", { name: "Forgot password?" }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, loading: false });
  });

  it("renders the sign-in form by default", () => {
    renderForm();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(getPasswordInput()).not.toBeNull();
  });

  it("redirects when the user is already signed in", () => {
    useAuthStore.setState({ user: { uid: "u1" } as User, loading: false });
    renderForm();
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon");
  });

  it("shows validation errors on empty submit", async () => {
    renderForm();
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("signs in with valid credentials", async () => {
    signInMock.mockResolvedValue({});
    renderForm();
    await userEvent.type(screen.getByRole("textbox"), "ash@example.com");
    await userEvent.type(getPasswordInput(), "Secret1");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(signInMock).toHaveBeenCalledWith(expect.anything(), "ash@example.com", "Secret1");
  });

  it("shows a translated error when sign-in fails", async () => {
    signInMock.mockRejectedValue(new FirebaseError("auth/wrong-password", "boom"));
    renderForm();
    await userEvent.type(screen.getByRole("textbox"), "ash@example.com");
    await userEvent.type(getPasswordInput(), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Incorrect password.");
  });

  it("toggles password visibility", async () => {
    renderForm();
    const input = getPasswordInput();
    expect(input).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("switches to the sign-up form", async () => {
    renderForm();
    await switchToSignUp();
    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(getConfirmInput()).not.toBeNull();
  });

  it("validates the sign-up password rules", async () => {
    renderForm();
    await switchToSignUp();
    await userEvent.type(screen.getByRole("textbox"), "ash@example.com");
    await userEvent.type(getPasswordInput(), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));
    expect(
      await screen.findByText("Must contain at least one uppercase letter"),
    ).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("requires matching passwords on sign-up", async () => {
    renderForm();
    await switchToSignUp();
    await userEvent.type(screen.getByRole("textbox"), "ash@example.com");
    await userEvent.type(getPasswordInput(), "Secret1");
    await userEvent.type(getConfirmInput(), "Secret2");
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
  });

  it("creates an account with valid sign-up values", async () => {
    signUpMock.mockResolvedValue({});
    renderForm();
    await switchToSignUp();
    await userEvent.type(screen.getByRole("textbox"), "ash@example.com");
    await userEvent.type(getPasswordInput(), "Secret1");
    await userEvent.type(getConfirmInput(), "Secret1");
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));
    expect(signUpMock).toHaveBeenCalledWith(expect.anything(), "ash@example.com", "Secret1");
  });

  it("signs in with Google", async () => {
    popupMock.mockResolvedValue({});
    renderForm();
    await userEvent.click(screen.getByRole("button", { name: /Continue with Google/ }));
    expect(popupMock).toHaveBeenCalled();
  });

  it("silently ignores a cancelled Google popup", async () => {
    popupMock.mockRejectedValue(new FirebaseError("auth/cancelled-popup-request", "boom"));
    renderForm();
    await userEvent.click(screen.getByRole("button", { name: /Continue with Google/ }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("switches to the forgot password form", async () => {
    renderForm();
    await switchToForgotPassword();
    expect(screen.getByText("Reset your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send reset link" })).toBeInTheDocument();
    expect(document.getElementById("password")).toBeNull();
  });

  it("validates email on forgot password submit", async () => {
    renderForm();
    await switchToForgotPassword();
    await userEvent.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(resetMock).not.toHaveBeenCalled();
  });

  it("sends a password reset email", async () => {
    resetMock.mockResolvedValue(undefined);
    renderForm();
    await switchToForgotPassword();
    await userEvent.type(screen.getByRole("textbox"), "ash@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(resetMock).toHaveBeenCalledWith(expect.anything(), "ash@example.com", {
      url: "http://localhost/en/login",
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Check your email for a password reset link.",
    );
  });

  it("shows an error when password reset fails", async () => {
    resetMock.mockRejectedValue(new FirebaseError("auth/too-many-requests", "boom"));
    renderForm();
    await switchToForgotPassword();
    await userEvent.type(screen.getByRole("textbox"), "ash@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Too many failed attempts. Please try again later.",
    );
  });

  it("returns to sign in from forgot password", async () => {
    renderForm();
    await switchToForgotPassword();
    await userEvent.click(screen.getByRole("button", { name: "Back to sign in" }));
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });
});
