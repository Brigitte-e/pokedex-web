import { useAuthStore } from "../auth";
import type { User } from "firebase/auth";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: true });
  });

  it("starts with no user and loading", () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(true);
  });

  it("stores the user and stops loading on setAuth", () => {
    const user = { uid: "abc" } as User;
    useAuthStore.getState().setAuth(user);
    expect(useAuthStore.getState().user).toBe(user);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it("clears the user on sign-out", () => {
    useAuthStore.getState().setAuth({ uid: "abc" } as User);
    useAuthStore.getState().setAuth(null);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });
});
