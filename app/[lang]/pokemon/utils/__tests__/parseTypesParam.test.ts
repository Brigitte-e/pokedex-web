import { parseTypesParam } from "../parseTypesParam";

describe("parseTypesParam", () => {
  it("returns an empty array when types is missing", () => {
    expect(parseTypesParam()).toEqual([]);
  });

  it("parses a comma-separated string", () => {
    expect(parseTypesParam("fire,water")).toEqual(["fire", "water"]);
  });

  it("sorts types for stable cache keys", () => {
    expect(parseTypesParam("water,fire")).toEqual(["fire", "water"]);
  });

  it("accepts an array from duplicate query keys", () => {
    expect(parseTypesParam(["fire", "water"])).toEqual(["fire", "water"]);
  });

  it("drops empty segments from malformed values", () => {
    expect(parseTypesParam("fire,")).toEqual(["fire"]);
    expect(parseTypesParam(",fire")).toEqual(["fire"]);
  });
});
