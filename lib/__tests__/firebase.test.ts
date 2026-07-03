import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

jest.mock("firebase/app", () => ({ initializeApp: jest.fn(() => "new-app"), getApps: jest.fn() }));
jest.mock("firebase/auth", () => ({ getAuth: jest.fn(() => "auth") }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn(() => "db") }));

const ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

function loadModule() {
  let mod!: typeof import("../firebase");
  jest.isolateModules(() => {
    mod = jest.requireActual("../firebase");
  });
  return mod;
}

describe("firebase bootstrap", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    ENV_KEYS.forEach((key) => (process.env[key] = "value"));
    (getApps as jest.Mock).mockReturnValue([]);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("initializes the app and returns auth", () => {
    expect(loadModule().getFirebaseAuth()).toBe("auth");
    expect(initializeApp).toHaveBeenCalled();
    expect(getAuth).toHaveBeenCalledWith("new-app");
  });

  it("returns firestore for the initialized app", () => {
    expect(loadModule().getFirebaseDb()).toBe("db");
    expect(getFirestore).toHaveBeenCalledWith("new-app");
  });

  it("reuses an already initialized app", () => {
    (getApps as jest.Mock).mockReturnValue(["existing-app"]);
    loadModule().getFirebaseAuth();
    expect(initializeApp).not.toHaveBeenCalled();
    expect(getAuth).toHaveBeenCalledWith("existing-app");
  });

  it("throws a helpful error when env vars are missing", () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    expect(() => loadModule().getFirebaseAuth()).toThrow(/Missing Firebase env vars/);
    expect(initializeApp).not.toHaveBeenCalled();
  });
});
