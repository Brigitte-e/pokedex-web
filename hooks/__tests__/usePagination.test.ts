import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../usePagination";

let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  usePathname: () => "/en/pokemon",
  useSearchParams: () => mockSearchParams,
}));

const PAGE_SIZE = 20;
const LARGE_COUNT = 1000;

describe("usePagination", () => {
  let replaceStateSpy: jest.SpyInstance;

  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    replaceStateSpy = jest.spyOn(window.history, "replaceState");
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
  });

  it("defaults to page 1 when no query param is present", () => {
    const { result } = renderHook(() => usePagination({ pageSize: PAGE_SIZE }));
    expect(result.current.page).toBe(1);
  });

  it("reads the current page from the query param", () => {
    mockSearchParams = new URLSearchParams("page=3");
    const { result } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: LARGE_COUNT }),
    );
    expect(result.current.page).toBe(3);
  });

  it("uses initialPage when the query param is not yet available", () => {
    const { result } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: LARGE_COUNT, initialPage: 3 }),
    );
    expect(result.current.page).toBe(3);
  });

  it("sets the page query param when navigating forward", () => {
    const { result } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: LARGE_COUNT }),
    );
    act(() => result.current.setPage(2));
    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/en/pokemon?page=2");
    expect(result.current.page).toBe(2);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("removes the page param when navigating to page 1", () => {
    mockSearchParams = new URLSearchParams("page=3");
    const { result } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: LARGE_COUNT }),
    );
    act(() => result.current.setPage(1));
    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/en/pokemon");
  });

  it("preserves other query params", () => {
    mockSearchParams = new URLSearchParams("type=fire");
    const { result } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: LARGE_COUNT }),
    );
    act(() => result.current.setPage(2));
    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/en/pokemon?type=fire&page=2");
  });

  it("does nothing when navigating to the current page", () => {
    mockSearchParams = new URLSearchParams("page=2");
    const { result } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: LARGE_COUNT }),
    );
    act(() => result.current.setPage(2));
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it("syncs local page when the URL changes externally", () => {
    const { result, rerender } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: LARGE_COUNT }),
    );
    expect(result.current.page).toBe(1);

    mockSearchParams = new URLSearchParams("page=4");
    rerender();

    expect(result.current.page).toBe(4);
  });

  it("computes totalPages from count and pageSize", () => {
    const { result } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: 45 }),
    );
    expect(result.current.totalPages).toBe(3);
  });

  it("clamps effectivePage when page exceeds totalPages", () => {
    mockSearchParams = new URLSearchParams("page=5");
    const { result } = renderHook(() =>
      usePagination({ pageSize: PAGE_SIZE, initialCount: 40 }),
    );
    expect(result.current.effectivePage).toBe(2);
  });
});
