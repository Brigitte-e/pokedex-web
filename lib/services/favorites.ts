import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { FavoriteItem } from "@/types/favorite";

// ── Cypress e2e seam ──────────────────────────────────────────────────────────
// Tests seed `window.__E2E_FAVORITES__` (only honored when `window.Cypress`
// exists) to back favorites with an in-memory store instead of Firestore.
type E2EWindow = Window & { Cypress?: unknown; __E2E_FAVORITES__?: FavoriteItem[] };

const e2eListeners = new Set<(items: FavoriteItem[]) => void>();

function e2eWindow(): E2EWindow | null {
  if (typeof window === "undefined") return null;
  const w = window as E2EWindow;
  return w.Cypress && w.__E2E_FAVORITES__ ? w : null;
}

function e2eNotify(w: E2EWindow) {
  e2eListeners.forEach((cb) => cb([...(w.__E2E_FAVORITES__ ?? [])]));
}
// ──────────────────────────────────────────────────────────────────────────────

function favoritesRef(userId: string) {
  return collection(getFirebaseDb(), "users", userId, "favorites");
}

function favoriteDocRef(userId: string, itemId: string) {
  return doc(getFirebaseDb(), "users", userId, "favorites", itemId);
}

export async function addFavorite(
  userId: string,
  item: Omit<FavoriteItem, "createdAt">
): Promise<void> {
  const w = e2eWindow();
  if (w) {
    w.__E2E_FAVORITES__ = [...(w.__E2E_FAVORITES__ ?? []).filter((f) => f.id !== item.id), item];
    e2eNotify(w);
    return;
  }
  const data = Object.fromEntries(
    Object.entries({ ...item, createdAt: serverTimestamp() }).filter(
      ([, v]) => v !== undefined
    )
  );
  await setDoc(favoriteDocRef(userId, item.id), data);
}

export async function removeFavorite(
  userId: string,
  itemId: string
): Promise<void> {
  const w = e2eWindow();
  if (w) {
    w.__E2E_FAVORITES__ = (w.__E2E_FAVORITES__ ?? []).filter((f) => f.id !== itemId);
    e2eNotify(w);
    return;
  }
  await deleteDoc(favoriteDocRef(userId, itemId));
}

export async function getFavorites(userId: string): Promise<FavoriteItem[]> {
  const snap = await getDocs(favoritesRef(userId));
  return snap.docs.map((d) => d.data() as FavoriteItem);
}

export function subscribeToFavorites(
  userId: string,
  callback: (items: FavoriteItem[]) => void
): Unsubscribe {
  const w = e2eWindow();
  if (w) {
    e2eListeners.add(callback);
    callback([...(w.__E2E_FAVORITES__ ?? [])]);
    return () => e2eListeners.delete(callback);
  }
  return onSnapshot(favoritesRef(userId), (snap) => {
    const items = snap.docs.map((d) => d.data() as FavoriteItem);
    callback(items);
  });
}
