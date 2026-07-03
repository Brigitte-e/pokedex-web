import { FirebaseError } from "firebase/app";
import { getAuthErrorMessage } from "../firebase-errors";

const labels = {
  invalidCredential: "invalid credential",
  userNotFound: "user not found",
  wrongPassword: "wrong password",
  userDisabled: "user disabled",
  tooManyRequests: "too many requests",
  invalidEmail: "invalid email",
  emailAlreadyInUse: "email in use",
  weakPassword: "weak password",
  operationNotAllowed: "not allowed",
  popupClosedByUser: "popup closed",
  popupBlocked: "popup blocked",
  accountExistsWithDifferentCredential: "account exists",
  networkRequestFailed: "network failed",
  fallback: "fallback",
};

describe("getAuthErrorMessage", () => {
  it("maps a known firebase code to its label", () => {
    const err = new FirebaseError("auth/wrong-password", "boom");
    expect(getAuthErrorMessage(err, labels)).toBe("wrong password");
  });

  it("returns null for silently ignored codes", () => {
    const err = new FirebaseError("auth/cancelled-popup-request", "boom");
    expect(getAuthErrorMessage(err, labels)).toBeNull();
  });

  it("returns the fallback for unknown firebase codes", () => {
    const err = new FirebaseError("auth/some-new-code", "boom");
    expect(getAuthErrorMessage(err, labels)).toBe("fallback");
  });

  it("returns the fallback for non-firebase errors", () => {
    expect(getAuthErrorMessage(new Error("boom"), labels)).toBe("fallback");
  });
});
