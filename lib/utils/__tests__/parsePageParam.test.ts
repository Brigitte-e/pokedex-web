import { parsePageParam } from "../parsePageParam";

describe("parsePageParam", () => {
  it("defaults page to 1 when no searchParams are given", () => {
    expect(parsePageParam()).toEqual({ page: 1 });
  });

  it("defaults to 1 for missing or invalid page values", () => {
    expect(parsePageParam({ page: "" }).page).toBe(1);
    expect(parsePageParam({ page: "0" }).page).toBe(1);
    expect(parsePageParam({ page: "-2" }).page).toBe(1);
    expect(parsePageParam({ page: "abc" }).page).toBe(1);
  });

  it("parses valid page numbers", () => {
    expect(parsePageParam({ page: "3" }).page).toBe(3);
    expect(parsePageParam({ page: ["5"] }).page).toBe(5);
  });

  it("leaves backHref undefined when not provided", () => {
    expect(parsePageParam().backHref).toBeUndefined();
    expect(parsePageParam({ page: "2" }).backHref).toBeUndefined();
  });

  it("parses the backHref when provided", () => {
    expect(parsePageParam({ backHref: "/en/pokemon?page=2" }).backHref).toBe(
      "/en/pokemon?page=2",
    );
  });

  it("uses the first value when backHref is provided as an array", () => {
    expect(
      parsePageParam({ backHref: ["/en/pokemon?page=2", "/en/pokemon?page=3"] }).backHref,
    ).toBe("/en/pokemon?page=2");
  });
});
