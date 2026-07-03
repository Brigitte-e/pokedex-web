"use client";

import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth";

// Cypress e2e seam: tests seed `window.__E2E_USER__` before the app loads
// to simulate a signed-in user without a real Firebase session.
type E2EWindow = Window & { Cypress?: unknown; __E2E_USER__?: User | null };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const w = window as E2EWindow;
    if (w.Cypress && w.__E2E_USER__ !== undefined) {
      setAuth(w.__E2E_USER__);
      return;
    }
    const unsubscribe = onAuthStateChanged(
      getFirebaseAuth(),
      (user) => setAuth(user),
      () => setAuth(null),
    );
    return unsubscribe;
  }, [setAuth]);

  return <>{children}</>;
}
