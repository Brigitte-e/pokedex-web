import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/constants";

const locales: readonly string[] = LOCALES;
const defaultLocale = DEFAULT_LOCALE;

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  for (const part of acceptLanguage.split(",")) {
    const lang = part.split(";")[0].trim().toLowerCase().split("-")[0];
    if (locales.includes(lang)) return lang;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    const locale = locales.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    )!;
    if (pathname === `/${locale}`) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/pokemon`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  // Send the bare root straight to the pokedex in one hop.
  url.pathname = pathname === "/" ? `/${locale}/pokemon` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|__/|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.webp$|.*\\.gif$|.*\\.ico$|.*\\.woff2$|.*\\.woff$|.*\\.ttf$|.*\\.otf$).*)"],
};
