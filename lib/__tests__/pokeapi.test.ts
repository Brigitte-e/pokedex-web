import { getPokemonSprite, getIdFromUrl, capitalize } from "../pokeapi";
import { POKE_SPRITES_BASE_URL } from "@/lib/constants";

describe("getPokemonSprite", () => {
  it("builds the sprite URL from a numeric id", () => {
    expect(getPokemonSprite(25)).toBe(
      `${POKE_SPRITES_BASE_URL}/pokemon/other/official-artwork/25.png`,
    );
  });

  it("builds the sprite URL from a numeric string", () => {
    expect(getPokemonSprite("25")).toBe(
      `${POKE_SPRITES_BASE_URL}/pokemon/other/official-artwork/25.png`,
    );
  });

  it("keeps a non-numeric name as the segment", () => {
    expect(getPokemonSprite("pikachu")).toBe(
      `${POKE_SPRITES_BASE_URL}/pokemon/other/official-artwork/pikachu.png`,
    );
  });
});

describe("getIdFromUrl", () => {
  it("extracts the trailing id from a resource URL", () => {
    expect(getIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
  });

  it("works without a trailing slash", () => {
    expect(getIdFromUrl("https://pokeapi.co/api/v2/pokemon/151")).toBe(151);
  });
});

describe("capitalize", () => {
  it("capitalizes a single word", () => {
    expect(capitalize("pikachu")).toBe("Pikachu");
  });

  it("replaces dashes with spaces and capitalizes each word", () => {
    expect(capitalize("mr-mime")).toBe("Mr Mime");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});
