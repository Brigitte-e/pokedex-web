const BASE = process.env.NEXT_PUBLIC_POKE_API_URL;

export async function get<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`PokeAPI error ${res.status}: ${path}`);
  return res.json();
}
