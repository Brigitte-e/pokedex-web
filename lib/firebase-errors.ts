import { FirebaseError } from "firebase/app";

const codeToKey: Record<string, string | null> = {
  "auth/invalid-credential": "invalidCredential",
  "auth/user-not-found": "userNotFound",
  "auth/wrong-password": "wrongPassword",
  "auth/user-disabled": "userDisabled",
  "auth/too-many-requests": "tooManyRequests",
  "auth/invalid-email": "invalidEmail",
  "auth/email-already-in-use": "emailAlreadyInUse",
  "auth/weak-password": "weakPassword",
  "auth/operation-not-allowed": "operationNotAllowed",
  "auth/popup-closed-by-user": "popupClosedByUser",
  "auth/popup-blocked": "popupBlocked",
  "auth/cancelled-popup-request": null, // silently ignored
  "auth/account-exists-with-different-credential": "accountExistsWithDifferentCredential",
  "auth/network-request-failed": "networkRequestFailed",
};

type Translate = (key: string) => string;

export function getAuthErrorMessage(err: unknown, t: Translate): string | null {
  if (err instanceof FirebaseError) {
    const key = codeToKey[err.code];
    if (key === null) return null; // explicitly silenced
    return t(`auth.errors.${key ?? "fallback"}`);
  }
  return t("auth.errors.fallback");
}
