import { getDailyPick } from "../pokemon-of-the-day";
import { TOTAL_POKEMON } from "@/lib/constants";

const DAY_MS = 86_400_000;

describe("getDailyPick", () => {
  it("is deterministic within the same UTC day", () => {
    const now = Date.UTC(2026, 6, 3, 0, 0, 0);
    const later = Date.UTC(2026, 6, 3, 23, 59, 59);
    expect(getDailyPick(now)).toEqual(getDailyPick(later));
  });

  it("changes when the UTC day changes", () => {
    const today = Date.UTC(2026, 6, 3);
    const tomorrow = today + DAY_MS;
    expect(getDailyPick(today).dayKey).not.toBe(getDailyPick(tomorrow).dayKey);
  });

  it("always returns an id within the valid pokemon range", () => {
    for (let i = 0; i < 30; i++) {
      const { id } = getDailyPick(Date.UTC(2026, 0, 1) + i * DAY_MS);
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(TOTAL_POKEMON);
    }
  });

  it("uses the UTC day number as the dayKey", () => {
    const now = Date.UTC(2026, 6, 3);
    expect(getDailyPick(now).dayKey).toBe(String(Math.floor(now / DAY_MS)));
  });
});
