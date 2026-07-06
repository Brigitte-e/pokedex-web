jest.mock("server-only", () => ({}), { virtual: true });

import { t } from "../i18n/core";
import { getDictionary } from "../i18n";
import en from "@/messages/en.json";

describe("t", () => {
  it("resolves a nested key", () => {
    expect(t(en, "nav.pokemon")).toBe("Pokémon");
  });

  it("returns the key itself when the message is missing", () => {
    expect(t(en, "nav.doesNotExist")).toBe("nav.doesNotExist");
  });

  it("replaces params in the message", () => {
    expect(t(en, "common.pageOfTotal", { page: 2, total: 10 })).toBe("2 / 10");
  });

  it("replaces repeated placeholders", () => {
    expect(t(en, "favorites.savedCount", { count: 3 })).toBe("3 saved Pokémon");
  });
});

describe("getDictionary", () => {
  it("loads the dictionary for a locale", async () => {
    const dict = await getDictionary("de");
    expect(dict.nav.pokemon).toBeTruthy();
  });
});
