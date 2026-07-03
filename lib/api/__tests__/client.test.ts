import { get, ApiError, isNotFoundError } from "../client";
import { POKE_API_BASE_URL } from "@/lib/constants";

describe("get", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("prefixes relative paths with the API base URL", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ name: "pikachu" }) });
    const data = await get<{ name: string }>("/pokemon/pikachu");
    expect(fetchMock).toHaveBeenCalledWith(
      `${POKE_API_BASE_URL}/pokemon/pikachu`,
      expect.anything(),
    );
    expect(data).toEqual({ name: "pikachu" });
  });

  it("uses absolute URLs as-is", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    await get("https://example.com/resource");
    expect(fetchMock).toHaveBeenCalledWith("https://example.com/resource", expect.anything());
  });

  it("throws an ApiError with the response status on failure", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 });
    await expect(get("/pokemon/missing")).rejects.toThrow(ApiError);
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    await expect(get("/pokemon/broken")).rejects.toMatchObject({ status: 500 });
  });
});

describe("isNotFoundError", () => {
  it("returns true for a 404 ApiError", () => {
    expect(isNotFoundError(new ApiError(404, "/x"))).toBe(true);
  });

  it("returns false for other statuses", () => {
    expect(isNotFoundError(new ApiError(500, "/x"))).toBe(false);
  });

  it("returns false for non-ApiError values", () => {
    expect(isNotFoundError(new Error("boom"))).toBe(false);
  });
});
