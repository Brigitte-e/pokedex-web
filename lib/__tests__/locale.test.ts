import {
  getLocalizedName,
  getLocalizedEffect,
  getLocalizedFlavorText,
  getLocalizedDescription,
} from "../locale";
import type { LocalizedName, LocalizedEffect, LocalizedFlavorText } from "@/types";

const names: LocalizedName[] = [
  { name: "Glumanda", language: { name: "de", url: "" } },
  { name: "Charmander", language: { name: "en", url: "" } },
];

describe("getLocalizedName", () => {
  it("returns the name matching the locale", () => {
    expect(getLocalizedName(names, "de", "fallback")).toBe("Glumanda");
  });

  it("returns the fallback when the locale is missing", () => {
    expect(getLocalizedName(names, "es", "fallback")).toBe("fallback");
  });
});

describe("getLocalizedEffect", () => {
  const entries: LocalizedEffect[] = [
    { effect: "Long effect", short_effect: "Short effect", language: { name: "en", url: "" } },
    { effect: "Langer Effekt", short_effect: "", language: { name: "de", url: "" } },
  ];

  it("prefers short_effect in the requested locale", () => {
    expect(getLocalizedEffect(entries, "en")).toBe("Short effect");
  });

  it("falls back to effect when short_effect is empty", () => {
    expect(getLocalizedEffect(entries, "de")).toBe("Langer Effekt");
  });

  it("falls back to english when the locale is missing", () => {
    expect(getLocalizedEffect(entries, "es")).toBe("Short effect");
  });

  it("returns undefined when nothing matches", () => {
    expect(getLocalizedEffect([], "en")).toBeUndefined();
  });
});

describe("getLocalizedFlavorText", () => {
  const entries: LocalizedFlavorText[] = [
    { flavor_text: "Line one\nline two\ftail", language: { name: "en", url: "" } },
    { text: "Item text", language: { name: "de", url: "" } },
  ];

  it("normalizes control characters to spaces", () => {
    expect(getLocalizedFlavorText(entries, "en")).toBe("Line one line two tail");
  });

  it("reads the `text` field used by items", () => {
    expect(getLocalizedFlavorText(entries, "de")).toBe("Item text");
  });

  it("falls back to english when the locale is missing", () => {
    expect(getLocalizedFlavorText(entries, "es")).toBe("Line one line two tail");
  });
});

describe("getLocalizedDescription", () => {
  const effects: LocalizedEffect[] = [
    { effect: "English effect", short_effect: "", language: { name: "en", url: "" } },
  ];
  const flavors: LocalizedFlavorText[] = [
    { flavor_text: "German flavor", language: { name: "de", url: "" } },
  ];

  it("prefers locale flavor over english effect", () => {
    expect(getLocalizedDescription(effects, flavors, "de")).toBe("German flavor");
  });

  it("falls back to english effect for unmatched locales", () => {
    expect(getLocalizedDescription(effects, flavors, "es")).toBe("English effect");
  });

  it("returns undefined when no entries exist", () => {
    expect(getLocalizedDescription([], [], "en")).toBeUndefined();
  });
});
