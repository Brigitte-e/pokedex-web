interface ParsedSearchParams {
  page?: number;
  backHref?: string;
}

function parseSingle(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(page?: string | string[]): number {
  const raw = parseSingle(page);
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export function parsePageParam(searchParams?: RawSearchParams): ParsedSearchParams {
  return {
    page: parsePage(searchParams?.page),
    backHref: parseSingle(searchParams?.backHref),
  };
}
