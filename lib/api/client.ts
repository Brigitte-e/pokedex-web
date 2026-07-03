import { API_REVALIDATE_SECONDS, POKE_API_BASE_URL } from "@/lib/constants";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    path: string,
  ) {
    super(`PokeAPI error ${status}: ${path}`);
    this.name = "ApiError";
  }
}

export function isNotFoundError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}

export async function get<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${POKE_API_BASE_URL}${path}`;
  const res = await fetch(url, { next: { revalidate: API_REVALIDATE_SECONDS } });
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json();
}
