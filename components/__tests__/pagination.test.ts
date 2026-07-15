import { getVisiblePages } from "../pagination/pagination";

describe("getVisiblePages", () => {
  it("returns all pages when total is small", () => {
    expect(getVisiblePages(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("includes ellipsis for large page counts", () => {
    expect(getVisiblePages(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
  });

  it("shows leading pages near the start", () => {
    expect(getVisiblePages(2, 20)).toEqual([1, 2, 3, 4, "ellipsis", 20]);
  });

  it("shows trailing pages near the end", () => {
    expect(getVisiblePages(19, 20)).toEqual([1, "ellipsis", 17, 18, 19, 20]);
  });
});
