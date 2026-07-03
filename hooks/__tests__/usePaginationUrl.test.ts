import { renderHook, act } from "@testing-library/react";
import { usePaginationUrl } from "../usePaginationUrl";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/en/pokemon",
  useSearchParams: () => mockSearchParams,
}));

describe("usePaginationUrl", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
    window.scrollTo = jest.fn();
  });

  it("defaults to page 1 when no query param is present", () => {
    const { result } = renderHook(() => usePaginationUrl());
    expect(result.current[0]).toBe(1);
  });

  it("reads the current page from the query param", () => {
    mockSearchParams = new URLSearchParams("page=3");
    const { result } = renderHook(() => usePaginationUrl());
    expect(result.current[0]).toBe(3);
  });

  it("sets the page query param when navigating forward", () => {
    const { result } = renderHook(() => usePaginationUrl());
    act(() => result.current[1](2));
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon?page=2", { scroll: false });
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("removes the page param when navigating to page 1", () => {
    mockSearchParams = new URLSearchParams("page=3");
    const { result } = renderHook(() => usePaginationUrl());
    act(() => result.current[1](1));
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon", { scroll: false });
  });

  it("preserves other query params", () => {
    mockSearchParams = new URLSearchParams("type=fire");
    const { result } = renderHook(() => usePaginationUrl());
    act(() => result.current[1](2));
    expect(mockReplace).toHaveBeenCalledWith("/en/pokemon?type=fire&page=2", { scroll: false });
  });

  it("does nothing when navigating to the current page", () => {
    mockSearchParams = new URLSearchParams("page=2");
    const { result } = renderHook(() => usePaginationUrl());
    act(() => result.current[1](2));
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
