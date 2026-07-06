import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { useAuthStore } from "@/store/auth";
import { useFavoritesStore } from "@/store/favorites";

// jsdom does not implement scrollIntoView, used by listbox keyboard navigation.
window.HTMLElement.prototype.scrollIntoView = jest.fn();

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe() {
    this.callback([{ isIntersecting: false } as IntersectionObserverEntry], this);
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

afterEach(() => {
  // Unmount before resetting stores, otherwise setState re-renders
  // still-mounted components outside act() and React warns.
  cleanup();
  localStorage.clear();
  useAuthStore.setState({ user: null, loading: false });
  useFavoritesStore.setState({ favorites: [] });
});
