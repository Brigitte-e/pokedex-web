/** Minimal shape stored locally (Zustand) and used by UI components. */
export interface FavoriteEntry {
  id: string;
  name: string;
}

/** Shape stored in Firestore under users/{userId}/favorites/{itemId}. */
export interface FavoriteItem {
  id: string;
  name: string;
  image?: string;
  type?: string;
  source?: string;
  createdAt?: unknown; // serverTimestamp() on write; Timestamp on read
}
