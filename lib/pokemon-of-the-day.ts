import { TOTAL_POKEMON } from "@/lib/constants";

export interface DailyPick {
  id: number;
  /** UTC day number; lets the client tell whether a stored reveal is from today. */
  dayKey: string;
}

/** Deterministic pick: every visitor sees the same pokemon on a given UTC day. */
export function getDailyPick(now: number = Date.now()): DailyPick {
  const day = Math.floor(now / 86_400_000);
  return { id: ((day * 2654435761) % TOTAL_POKEMON) + 1, dayKey: String(day) };
}
