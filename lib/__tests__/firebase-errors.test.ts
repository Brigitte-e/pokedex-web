import { FirebaseError } from "firebase/app";
import { getAuthErrorMessage } from "../firebase-errors";

const labels: Record<string, string> = {
  wrongPassword: "wrong password",
  fallback: "fallback",
};

// Stand-in for the client translator: maps `auth.errors.<key>` to a label.
const t = (key: string) => labels[key.replace("auth.errors.", "")] ?? key;

describe("getAuthErrorMessage", () => {
  it("maps a known firebase code to its label", () => {
    const err = new FirebaseError("auth/wrong-password", "boom");
    expect(getAuthErrorMessage(err, t)).toBe("wrong password");
  });

  it("returns null for silently ignored codes", () => {
    const err = new FirebaseError("auth/cancelled-popup-request", "boom");
    expect(getAuthErrorMessage(err, t)).toBeNull();
  });

  it("returns the fallback for unknown firebase codes", () => {
    const err = new FirebaseError("auth/some-new-code", "boom");
    expect(getAuthErrorMessage(err, t)).toBe("fallback");
  });

  it("returns the fallback for non-firebase errors", () => {
    expect(getAuthErrorMessage(new Error("boom"), t)).toBe("fallback");
  });
});
