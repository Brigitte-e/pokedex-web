export function parseTypesParam(types?: string | string[]): string[] {
  if (!types) return [];

  const raw = Array.isArray(types) ? types : types.split(",");
  return raw.filter(Boolean).sort();
}
